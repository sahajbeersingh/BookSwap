const supabase = require('../config/supabaseClient');

const createListing = async (req, res) => {
  try {
    let { book_id, price, condition, description } = req.body;

    // TEMP seller_id (replace later with user.id)
    const seller_id = "41f94749-48ff-47b3-8d6b-567e57b283d9";

    if (!book_id || !price || !condition) {
      return res.status(400).json({
        error: "book_id, price and condition are required"
      });
    }

    const { data, error } = await supabase
      .from('listings')
      .insert([
        {
          book_id,
          seller_id,
          price,
          condition,
          description,
          status: "available"
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json({
      message: "Listing created",
      data: data[0]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllListings = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    const start = (page - 1) * limit;
    const end = start + Number(limit) - 1;

    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        books (*)
      `)
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) throw error;

    res.json({
      page: Number(page),
      limit: Number(limit),
      count: data.length,
      data
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        books (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, condition, description, status } = req.body;

    const { data, error } = await supabase
      .from('listings')
      .update({
        price,
        condition,
        description,
        status
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    res.json({
      message: "Listing updated",
      data: data[0]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      message: "Listing deleted"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing
};