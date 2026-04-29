import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, PageShell, SectionCard, StatusState } from "../components/PageLayout";
import { authApi, extractApiError } from "../lib/api";
import "./Profile.css";

const initialValues = {
  username: "",
  bio: "",
  city: "",
  location: "",
};

function EditProfile() {
  const navigate = useNavigate();

  const [values, setValues] = useState(initialValues);
  const [initialLoadedValues, setInitialLoadedValues] = useState(initialValues);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isUsernameValid = values.username.trim().length >= 3;
  const isBioValid = values.bio.length <= 300;
  const isCityValid = values.city.length <= 80;
  const isLocationValid = values.location.length <= 120;

  const isFormValid = isUsernameValid && isBioValid && isCityValid && isLocationValid;

  const hasChanges = useMemo(
    () =>
      Object.keys(values).some((key) => {
        const current = values[key]?.trim?.() ?? values[key];
        const initial = initialLoadedValues[key]?.trim?.() ?? initialLoadedValues[key];
        return current !== initial;
      }),
    [initialLoadedValues, values],
  );

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const profile = await authApi.getProfile();

        if (!cancelled) {
          const nextValues = {
            username: profile?.username || "",
            bio: profile?.bio || "",
            city: profile?.city || "",
            location: profile?.location || "",
          };

          setValues(nextValues);
          setInitialLoadedValues(nextValues);
        }
      } catch (apiError) {
        if (!cancelled) {
          setError(extractApiError(apiError, "Unable to load profile for editing."));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (key) => (event) => {
    setValues((prev) => ({
      ...prev,
      [key]: event.target.value,
    }));
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
      setSaving(true);

      const payload = {
        username: values.username.trim(),
        bio: values.bio.trim(),
        city: values.city.trim(),
        location: values.location.trim(),
      };

      await authApi.updateProfile(payload);
      setSuccess("Profile updated successfully. Redirecting...");

      setTimeout(() => {
        navigate("/profile");
      }, 850);
    } catch (apiError) {
      setError(extractApiError(apiError, "Unable to update profile right now."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Account"
        title="Edit profile"
        description="Update profile fields stored in your Supabase profile row."
        actions={
          <Link className="btn btn-ghost" to="/profile">
            Back to profile
          </Link>
        }
      />

      {loading ? (
        <StatusState
          tone="info"
          title="Loading editor"
          message="Fetching your current profile values..."
        />
      ) : null}

      {!loading ? (
        <SectionCard
          id="profile-editor"
          title="Profile fields"
          description="Save changes to username, bio, city, and location"
        >
          <form className="edit-profile-form" noValidate onSubmit={handleSubmit}>
            <label htmlFor="edit-username">
              Username *
              <input
                id="edit-username"
                type="text"
                value={values.username}
                onChange={handleChange("username")}
                aria-invalid={submitted && !isUsernameValid}
                required
              />
            </label>
            {submitted && !isUsernameValid ? (
              <p className="field-error">Username must be at least 3 characters.</p>
            ) : null}

            <label htmlFor="edit-bio">
              Bio
              <textarea
                id="edit-bio"
                rows="4"
                value={values.bio}
                onChange={handleChange("bio")}
                aria-invalid={submitted && !isBioValid}
                placeholder="Tell the community what you like to read."
              />
            </label>
            {submitted && !isBioValid ? (
              <p className="field-error">Bio must be 300 characters or less.</p>
            ) : null}

            <label htmlFor="edit-city">
              City
              <input
                id="edit-city"
                type="text"
                value={values.city}
                onChange={handleChange("city")}
                aria-invalid={submitted && !isCityValid}
              />
            </label>
            {submitted && !isCityValid ? (
              <p className="field-error">City must be 80 characters or less.</p>
            ) : null}

            <label htmlFor="edit-location">
              Location
              <input
                id="edit-location"
                type="text"
                value={values.location}
                onChange={handleChange("location")}
                aria-invalid={submitted && !isLocationValid}
              />
            </label>
            {submitted && !isLocationValid ? (
              <p className="field-error">Location must be 120 characters or less.</p>
            ) : null}

            {error ? <StatusState tone="error" title="Save failed" message={error} /> : null}
            {success ? <StatusState tone="info" title="Saved" message={success} /> : null}

            <div className="form-actions">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={saving || !hasChanges}
              >
                {saving ? "Saving..." : "Save profile"}
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => navigate("/profile")}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </SectionCard>
      ) : null}
    </PageShell>
  );
}

export default EditProfile;
