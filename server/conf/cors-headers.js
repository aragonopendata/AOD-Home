function crosPermission(){
    this.permission = function(req, res, next) {
        res.header('Access-Control-Allow-Origin','*');
        res.header('Access-Control-Allow-Headers','Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Content-Type, Origin, X-Requested-With, Accept, Authorization');
        res.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, PATCH, OPTIONS');
        next();
    }
}
  
module.exports= new crosPermission();