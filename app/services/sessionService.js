var ourOnlyUser = "barbra";

var auth = function(req) {
  if (req.session && req.session.user == ourOnlyUser && req.session.login)
    return true;
  return false;
};

var login = function(req, userName){
    req.session.user = userName || ourOnlyUser;
    req.session.login = true;
    console.log(req.session.user + " has logged in");
    return true;
}

var logout = function(req){
    var user = req.session.user;
    req.session.destroy();
    console.log(user + " has logged out");
}

module.exports = {
    auth: auth,
    login: login,
    logout: logout
}