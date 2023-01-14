
const express = require('express');
const router = express.Router();
const {sql , con } = require('../db/db')
const auth = require('../../middleware/auth');


router.get('/', auth,  async (req, res)=>{
    con.query(`SELECT * FROM preference WHERE _pid=${req.user._id}` , (error , result, fields)=>{
        res.status(200).send(result);
    })
})


router.get('/preference/:id', auth, async (req, res)=>{
    con.query(`INSERT INTO preference values(${req.user._id},${req.params.id});`, (error, result, fields)=>{
        if(result.affectedRows < 0) res.status(404).send("The profile doesnt exist");
        res.status(200).send("Successfully added category _id " + req.params.id + " to preference");
    })
});


router.delete('/preference/:id',auth, async (req, res)=>{
    con.query(`DELETE FROM preference WHERE _pid = ${req.user._id} and _cid=${req.params.id};`, (error, result, fields)=>{
        if(result.affectedRows < 0) res.status(404).send("The profile doesnt exist");
        res.status(200).send("Successfully removed  category  _id " +  req.params.id + " from preference" );
    })
});



module.exports = router;