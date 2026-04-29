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

    res.status(201).json(data);

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

exports.getProfile = async(req,res) => {
  try{
    const{data,error} = await supabase
      .from('profiles')
      .select('*')
      .eq('id',req.user.id)
      .single();

    if(error) throw error;

    res.status(200).json(data);
  }catch(err){
    res.status(404).json({error: err.message});
  }
};

exports.updateProfile = async(req,res) => {
  try{
    const allowedFields = ['username', 'bio', 'city', 'location'];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
