const supabase = require('../config/supabaseClient');

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
  getAllBooks
};