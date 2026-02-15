const supabase = require('../config/supabaseClient');

exports.signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;
    const userId = data.user.id;

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username
      });

    if (profileError) throw profileError;

    res.status(201).json({ message: "User created successfully" });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    res.status(200).json(data);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ error: "No token" });

    const { data, error } = await supabase.auth.getUser(token);

    if (error) throw error;

    res.status(200).json(data.user);

  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
