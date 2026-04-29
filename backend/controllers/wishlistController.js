const supabase = require("../config/supabaseClient");

exports.getWishlist = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("wishlist")
      .select("*, books (*)")
      .eq("user_id", req.user.id);

    if (error) throw error;

    res.status(200).json({ message: "Wishlist fetched", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { book_id } = req.body;

    if (!book_id) {
      return res.status(400).json({ error: "book_id is required" });
    }

    const { data, error } = await supabase
      .from("wishlist")
      .insert({ user_id: req.user.id, book_id })
      .select("*, books (*)")
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Book added to wishlist", data });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Book already in wishlist" });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;

    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", req.user.id)
      .eq("book_id", bookId);

    if (error) throw error;

    res.status(200).json({ message: "Book removed from wishlist" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
