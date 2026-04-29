const supabase = require('../config/supabaseClient');

const ALLOWED_STATUSES = ['owned', 'lent', 'reading', 'completed'];
const ALLOWED_FIELDS  = ['condition', 'notes', 'status'];

exports.getCollection = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('collection')
      .select('*, books (*)')
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.status(200).json({ message: 'Collection fetched', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addToCollection = async (req, res) => {
  try {
    const { book_id, condition, notes, status } = req.body;

    if (!book_id) {
      return res.status(400).json({ error: 'book_id is required' });
    }

    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${ALLOWED_STATUSES.join(', ')}`
      });
    }

    const { data, error } = await supabase
      .from('collection')
      .insert({ user_id: req.user.id, book_id, condition, notes, status })
      .select('*, books (*)')
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Book added to collection', data });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Book already in collection' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.updateCollectionItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};
    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided' });
    }

    if (updates.status && !ALLOWED_STATUSES.includes(updates.status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${ALLOWED_STATUSES.join(', ')}`
      });
    }

    const { data, error } = await supabase
      .from('collection')
      .update(updates)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select('*, books (*)')
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Item not found' });

    res.status(200).json({ message: 'Collection item updated', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFromCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('collection')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.status(200).json({ message: 'Book removed from collection' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
