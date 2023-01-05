var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "@Ashlesh09",
  database : 'demodb'
  
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


module.exports = {
    sql : mysql,
    con 
}