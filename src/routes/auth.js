const express = require('express');
const router = express.Router();
const {sql , con } = require('../db/db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');


router.post("/signup", async (req, res)=>{

    con.query(`SELECT * FROM auth WHERE email='${req.body.email}';`, async (err, result, fields)=>{
        if(result.length !=0) return res.status(409).send("user already exists");
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash( req.body.password , salt);
        con.query(`INSERT INTO auth(email,password) VALUES('${req.body.email}','${password}')`, function (err, result, fields) {
            console.log(result);
            console.log(result.insertId)
            const token = jwt.sign({ _id: result.insertId}, config.get('jwtPrivateKey'));
            return res.cookie('x-auth-token', token).status(200).send(token);                
        });  
    })
})




router.post("/login", async (req, res)=>{
    con.query(`SELECT * FROM auth WHERE email='${req.body.email}';`, async (err, result, fields)=>{
        if(result.length ==0) return res.status(404).send("user not found ! please signup");
        const validPassword = await bcrypt.compare(req.body.password, result[0].password);
        if(!validPassword) return res.status(404).send('invalid email or password');
        const token = jwt.sign({ _id: result[0]._id }, config.get('jwtPrivateKey'));
        return res.cookie('x-auth-token', token).status(200).send(token);
    })
})




router.get("/logout", async (req, res)=>{
    res.clearCookie("x-auth-token");
    res.end("user logged out")
})





module.exports = router;


