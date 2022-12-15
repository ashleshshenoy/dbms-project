const express = require('express');
const router = express.Router();
const {sql , con } = require('../db/db')




router.post("/signup", async (req, res)=>{

    con.query(`SELECT * FROM user WHERE email='${req.body.email}';`, (err, result, fields)=>{
        if(result.length !=0) return res.send("user already exists");
        con.query(`INSERT INTO user VALUES('${req.body.email}','${req.body.password}')`, function (err, result, fields) {
            res.send(result)
        });  
    })
})


router.post("/login", async (req, res)=>{
    con.query(`SELECT * FROM user WHERE email='${req.body.email}';`, (err, result, fields)=>{
        if(result.length ==0) return res.send("user not found ! please signup");
        console.log(result)
        if(result.password == req.body.password)  
        res.send("loged in")
            //todo send  jwt token 
        else res.send("invalid password");
    })
})




module.exports = router;