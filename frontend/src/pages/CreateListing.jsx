import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, PageShell, SectionCard, StatusState } from "../components/PageLayout";
import { bookApi, extractApiError, listingApi } from "../lib/api";
import supabase from "../lib/supabaseClient";
import "./CreateListing.css";

const CONDITION_OPTIONS = [
  { value: "like_new", label: "Like New" },
  { value: "very_good", label: "Very Good" },
  { value: "good", label: "Good" },
  { value: "acceptable", label: "Acceptable" },
  { value: "new", label: "New" },
];

const initialBookValues = {
  title: "",
  author: "",
  isbn: "",
  publisher: "",
  publication_year: "",
  genre: "",
  description: "",
  cover_image: "",
};

const initialListingValues = {
  price: "",
  condition: "good",
  description: "",
};

const normalizeYear = (value) => {
  if (!value) {
    return "";
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : "";
};

function CreateListing() {
  const navigate = useNavigate();

  const [bookValues, setBookValues] = useState(initialBookValues);
  const [listingValues, setListingValues] = useState(initialListingValues);
  const [submitted, setSubmitted] = useState(false);
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validations = useMemo(() => {
    const year = normalizeYear(bookValues.publication_year);

    return {
      title: bookValues.title.trim().length >= 2,
      author: bookValues.author.trim().length >= 2,
      isbn: bookValues.isbn.trim().length >= 10,
      price: Number(listingValues.price) > 0,
      condition: CONDITION_OPTIONS.some((option) => option.value === listingValues.condition),
      publication_year:
        !bookValues.publication_year ||
        (Number.isInteger(year) && year >= 1400 && year <= new Date().getFullYear()),
      images: images.length >= 1 && images.length <= 7,
    };
  }, [bookValues, images, listingValues]);

  const isFormValid =
    validations.title &&
    validations.author &&
    validations.isbn &&
    validations.price &&
    validations.condition &&
    validations.publication_year &&
    validations.images;

  const handleBookChange = (key) => (event) => {
    setBookValues((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleListingChange = (key) => (event) => {
    setListingValues((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf", "image/jpg"];

    if (files.length === 0) {
      setImages([]);
      setImageError("Please add at least one photo.");
      return;
    }

    if (files.length > 7) {
      setImageError("You can upload up to 7 files.");
      return;
    }

    const invalidFile = files.find((file) => !allowedTypes.includes(file.type));
    if (invalidFile) {
      setImageError("Only JPG, JPEG, PNG, and PDF files are allowed.");
      return;
    }

    setImageError("");
    setImages(files);
  };

  const uploadImages = async (isbn) => {
    if (images.length === 0) {
      throw new Error("Please add at least one photo.");
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id || "anonymous";
    const safeIsbn = isbn.replace(/[^a-zA-Z0-9_-]/g, "");

    const uploads = await Promise.all(
      images.map(async (file, index) => {
        const extension = file.name.split(".").pop();
        const fileName = `${Date.now()}-${index}.${extension}`;
        const filePath = `${userId}/${safeIsbn || "listing"}/${fileName}`;

        const { error } = await supabase.storage
          .from("book-images")
          .upload(filePath, file, { upsert: false });

        if (error) {
          throw error;
        }

        const { data } = supabase.storage.from("book-images").getPublicUrl(filePath);
        return data?.publicUrl || "";
      }),
    );

    return uploads.filter(Boolean);
  };

  const handleReset = () => {
    setBookValues(initialBookValues);
    setListingValues(initialListingValues);
    setSubmitted(false);
    setError("");
    setSuccess("");
    setImages([]);
    setImageError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    setError("");
    setSuccess("");

    if (!isFormValid) {
      return;
    }

    try {
      setLoading(true);

      const isbn = bookValues.isbn.trim();
      setUploading(true);
      const uploadedUrls = await uploadImages(isbn);

      if (!uploadedUrls.length) {
        throw new Error("Image upload failed. Please try again.");
      }

      const matchedBooks = await bookApi.searchByIsbn(isbn);
      const existingBook = Array.isArray(matchedBooks) ? matchedBooks[0] : null;

      let bookId = existingBook?.id;

      if (!bookId) {
        const createBookPayload = {
          title: bookValues.title.trim(),
          author: bookValues.author.trim(),
          isbn,
          publisher: bookValues.publisher.trim() || null,
          publication_year: normalizeYear(bookValues.publication_year) || null,
          genre: bookValues.genre.trim() || null,
          description: bookValues.description.trim() || null,
          cover_image: uploadedUrls[0],
          images: uploadedUrls,
        };

        const createdBook = await bookApi.create(createBookPayload);
        bookId = createdBook?.data?.id;
      }

      if (!bookId) {
        throw new Error("Unable to resolve book for listing.");
      }

      const createListingPayload = {
        book_id: bookId,
        price: Number(listingValues.price),
        condition: listingValues.condition,
        description: listingValues.description.trim() || null,
      };

      const listingResponse = await listingApi.create(createListingPayload);
      const listingId = listingResponse?.data?.id;

      setSuccess("Listing created successfully. Redirecting to listing details...");

      setTimeout(() => {
        if (listingId) {
          navigate(`/books/${listingId}`);
        } else {
          navigate("/books");
        }
      }, 900);
    } catch (apiError) {
      setError(extractApiError(apiError, "Unable to create listing right now."));
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Sell"
        title="Create book listing"
        description="Add your book details and publish a listing for buyers and traders."
        actions={
          <Link className="btn btn-ghost" to="/books">
            Back to listings
          </Link>
        }
      />

      <SectionCard
        id="create-listing-form"
        title="Listing details"
        description="Fields marked mandatory are required to publish your listing."
      >
        <form className="create-listing-form" noValidate onSubmit={handleSubmit}>
          <fieldset>
            <legend>Book information</legend>

            <label htmlFor="book-title">
              Title *
              <input
                id="book-title"
                type="text"
                value={bookValues.title}
                onChange={handleBookChange("title")}
                aria-invalid={submitted && !validations.title}
                required
              />
            </label>
            {submitted && !validations.title ? (
              <p className="field-error">Title must be at least 2 characters.</p>
            ) : null}

            <label htmlFor="book-author">
              Author *
              <input
                id="book-author"
                type="text"
                value={bookValues.author}
                onChange={handleBookChange("author")}
                aria-invalid={submitted && !validations.author}
                required
              />
            </label>
            {submitted && !validations.author ? (
              <p className="field-error">Author must be at least 2 characters.</p>
            ) : null}

            <label htmlFor="book-isbn">
              ISBN *
              <input
                id="book-isbn"
                type="text"
                value={bookValues.isbn}
                onChange={handleBookChange("isbn")}
                aria-invalid={submitted && !validations.isbn}
                required
              />
            </label>
            {submitted && !validations.isbn ? (
              <p className="field-error">ISBN should be at least 10 characters.</p>
            ) : null}

            <label htmlFor="book-publisher">
              Publisher
              <input
                id="book-publisher"
                type="text"
                value={bookValues.publisher}
                onChange={handleBookChange("publisher")}
              />
            </label>

            <label htmlFor="book-year">
              Publication year
              <input
                id="book-year"
                type="number"
                min="1400"
                max={new Date().getFullYear()}
                value={bookValues.publication_year}
                onChange={handleBookChange("publication_year")}
                aria-invalid={submitted && !validations.publication_year}
              />
            </label>
            {submitted && !validations.publication_year ? (
              <p className="field-error">Enter a valid year between 1400 and current year.</p>
            ) : null}

            <label htmlFor="book-genre">
              Genre
              <input
                id="book-genre"
                type="text"
                value={bookValues.genre}
                onChange={handleBookChange("genre")}
              />
            </label>

            <label htmlFor="book-images">
              Upload photos *
              <input
                id="book-images"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                multiple
                onChange={handleImageChange}
              />
              <span className="field-hint">Add 1-7 images (JPG, JPEG, PNG, or PDF).</span>
            </label>
            {submitted && !validations.images ? (
              <p className="field-error">Please upload between 1 and 7 images.</p>
            ) : null}
            {imageError ? <p className="field-error">{imageError}</p> : null}

            <label htmlFor="book-description">
              Book description
              <textarea
                id="book-description"
                rows="3"
                value={bookValues.description}
                onChange={handleBookChange("description")}
              />
            </label>
          </fieldset>

          <fieldset>
            <legend>Listing information</legend>

            <label htmlFor="listing-price">
              Price (USD) *
              <input
                id="listing-price"
                type="number"
                min="0"
                step="0.01"
                value={listingValues.price}
                onChange={handleListingChange("price")}
                aria-invalid={submitted && !validations.price}
                required
              />
            </label>
            {submitted && !validations.price ? (
              <p className="field-error">Enter a valid price greater than 0.</p>
            ) : null}

            <label htmlFor="listing-condition">
              Condition *
              <select
                id="listing-condition"
                value={listingValues.condition}
                onChange={handleListingChange("condition")}
                aria-invalid={submitted && !validations.condition}
                required
              >
                {CONDITION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="listing-description">
              Listing note
              <textarea
                id="listing-description"
                rows="3"
                value={listingValues.description}
                onChange={handleListingChange("description")}
                placeholder="Mention annotations, highlighted pages, or bundle details."
              />
            </label>
          </fieldset>

          {error ? <StatusState tone="error" title="Submission failed" message={error} /> : null}
          {success ? <StatusState tone="info" title="Success" message={success} /> : null}

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={loading || uploading}>
              {loading || uploading ? "Publishing..." : "Publish listing"}
            </button>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={handleReset}
              disabled={loading || uploading}
            >
              Reset form
            </button>
          </div>
        </form>
      </SectionCard>
    </PageShell>
  );
}

export default CreateListing;
