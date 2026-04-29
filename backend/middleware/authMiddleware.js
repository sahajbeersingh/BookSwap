const supabase = require('../config/supabaseClient');

const authMiddleware = async(req, res, next) => {
  const authHeader = req.headers.authorization;

  if(!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({error: 'Unauthorized: No Token Provided'});
  }

  const token = authHeader.split(' ')[1];
  const {data,error} = await supabase.auth.getUser(token);

  if(error || !data?.user){
    return res.status(401).json({error: 'Unauthorized: No Token Provided'});
  }

  req.user = data.user;
  next();
};

module.exports = authMiddleware;
