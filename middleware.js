/*
 * Middle Ware
 *
 * path: /middleware.js
*/

module.exports.isLoggedIn = function(req,res,next){
  if(req.user){ next(); }
  else {
    req.flash("error", "Sorry you must be signed in to perform this action. Please log in");
    res.redirect("/");
  }
}

module.exports.denySignedIn = function(req,res,next){
  if(!req.user){ next(); }
  else {
    req.flash("error", "You cannot access this page")
    res.redirect("/profile");
  }
}

module.exports.renderWithMessages = (function(_render){

  return (function(view,locals,cb){

    this.locals.messages = {
      success: this.req.flash('success'),
      warning: this.req.flash('warning'),
      error: this.req.flash('error'),
      info: this.req.flash('info')
    };

    return _render.apply(this, arguments)

  });
});
