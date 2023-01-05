const express = require('express');
const router = express.Router();
const {sql , con } = require('../db/db')
const {upload} = require('../../middleware/profileimage');
const auth = require('../../middleware/auth');








router.post('/' , auth, upload.single("file"), async (req, res) => {
  con.query(`SELECT * FROM profile WHERE _id=${req.user._id};`, async function (err, result, fields) {
    if(result.length != 0) return res.status(409).send("user  profile already exists");
    con.query(`INSERT INTO profile VALUES(
      ${req.user._id}, '${req.body.username}', '${req.file.path}')`, async function (err, result2, fields){
      res.send("doen")
    })
    
  })
});


router.get('/', auth, async (req, res)=>{
  con.query(`SELECT * FROM profile WHERE _id=${req.user._id}`, async function (err, result,fields){
    if(result.length ==0)  res.status(404).send("user profile doesnt exists");
    else  res.status(200).send({
      username : result[0].username,
      img_url : result[0].img_url
    })
  })


})



module.exports = router;