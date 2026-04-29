const supabase = require('../config/supabaseClient');

const createBook = async (req, res) => {
  try {
    let {
      title,
      author,
      isbn,
      publisher,
      publication_year,
      genre,
      description,
      cover_image,
      images
    } = req.body;

    title = title?.trim();
    author = author?.trim();
    isbn = isbn?.trim();

    if (!title || !author || !isbn) {
      return res.status(400).json({
        error: "Title, author and ISBN are required"
      });
    }

    const { data: existing, error: fetchError } = await supabase
      .from('books')
      .select('id')
      .eq('isbn', isbn)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existing) {
      return res.status(400).json({
        error: "Book with this ISBN already exists"
      });
    }

    const normalizedImages = Array.isArray(images) ? images.slice(0, 7) : null;

    const { data, error } = await supabase
      .from('books')
      .insert([
        {
          title,
          author,
          isbn,
          publisher: publisher || null,
          publication_year: publication_year || null,
          genre: genre || null,
          description: description || null,
          cover_image: cover_image || null,
          images: normalizedImages && normalizedImages.length ? normalizedImages : null
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json({
      message: "Book created successfully",
      data: data[0]
    });

  } catch (error) {
    res.status(500).json({
      error: error.message || "Internal server error"
    });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    const start = (page - 1) * limit;
    const end = start + Number(limit) - 1;

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .range(start, end);

    if (error) throw error;

    res.status(200).json({
      page: Number(page),
      limit: Number(limit),
      count: data.length,
      data
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

const searchByTitle = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .ilike('title', `%${q}%`);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchByAuthor = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .ilike('author', `%${q}%`);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchByISBN = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'ISBN required' });
    }

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('isbn', q);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  searchByTitle,
  searchByAuthor,
  searchByISBN,
  getAllBooks,
  createBook
};
