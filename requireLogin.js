exports.requireLogin = async function(req, res, next) {
  if (!await req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}
