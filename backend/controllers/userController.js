const supabase = require("../config/supabaseClient");

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("profiles")
      .select("id, username")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};