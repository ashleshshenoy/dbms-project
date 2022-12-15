var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ashlesh09",
  database : 'demo'

});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


module.exports = {
    sql : mysql,
    con 
}