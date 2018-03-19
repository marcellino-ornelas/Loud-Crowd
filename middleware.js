/*
 * Middle Ware
 *
 * path: /middleware.js
*/

module.exports.isLoggedIn = function(req,res,next){
  if(req.user){ next(); }
  else {
    console.log("Access Denied");
    res.redirect("/");
  }
}

module.exports.denySignedIn = function(req,res,next){
  if(!req.user){ next(); }
  else {
    console.log("Access Denied");
    res.redirect("/profile");
  }
}
