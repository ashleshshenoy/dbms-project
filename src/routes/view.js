
const express = require('express');
const router = express.Router();
const {sql , con } = require('../db/db')
const auth = require('../../middleware/auth');


// add view to video
router.get('/:id',auth,  function (req, res) {
    con.query(`SELECT * FROM video_view WHERE _vid=${req.params.id} and _pid=${req.user._id}`, (error, result, field)=>{
        if(result != 0 ) res.end();
        con.query(`INSERT INTO video_view VALUES(${req.params.id}, ${req.user._id})`); 
        con.query(`UPDATE video SET view_count= view_count + 1 WHERE _id=${req.params.id}`) 
    })
})



module.exports = router;