/*
 * Middle Ware
*/

module.exports.initLocals = function(req,res,next){

  res.locals.user = req.user

  next();

}
