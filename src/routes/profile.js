const express = require('express');
const router = express.Router();
const {sql , con } = require('../db/db')
const {upload} = require('../../middleware/profileimage');
const auth = require('../../middleware/auth');




router.post('/' , auth, upload.single("file"), async (req, res) => {
  const filePath = (req.file)? req.file.path.split('/')[1]: "default.png" 
  con.query(`SELECT * FROM profile WHERE _id=${req.user._id};`, async function (err, result, fields) {
    if(result.length != 0) return res.status(409).send("user  profile already exists");
    con.query(`INSERT INTO profile VALUES(
      ${req.user._id}, '${req.body.username}', '${filePath}')`, async function (err, result2, fields){
      res.status(200).send("profile Created")
    })
    
  })
});


router.get('/', auth, async (req, res)=>{
  con.query(`SELECT * FROM profile WHERE _id=${req.user._id}`, async function (err, result,fields){
    if(result.length ==0)  res.status(404).send("user profile doesnt exists");
    else  res.status(200).send(result[0])
  })


})

router.patch('/', auth, upload.single("file"), async (req, res)=>{
  con.query(`SELECT * FROM profile WHERE _id=${req.user._id}`, (err, result, fields)=>{
    const filepath =  (req.file)?req.file.path.split('/')[1]: result[0].image_url 
    const username = (req.body.username)?  req.body.username : result[0].username
    console.log(filepath, username)

    con.query(`UPDATE profile set username='${username}', image_url='${filepath}' WHERE _id=${req.user._id}`, (err, result, fields)=>{
      if (err) console.log(err);
    })
  })

  res.status(200).send("updated")

})



module.exports = router;