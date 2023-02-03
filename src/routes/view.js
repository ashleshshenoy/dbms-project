
const express = require('express');
const router = express.Router();
const {sql , con } = require('../db/db')
const auth = require('../../middleware/auth');


// add view to video
router.get('/:id',auth,  function (req, res) {
    con.query(`SELECT * FROM view WHERE _vid=${req.params.id} and _pid=${req.user._id}`, (error, result, field)=>{
        console.log(result)
        if(result.length > 0 ) return res.status(200).send(" already exist");
        con.query(`INSERT INTO view(view_timestamp , _vid, _pid) VALUES( 0, ${req.params.id}, ${req.user._id})`); 
        con.query(`UPDATE video SET view_count= view_count + 1 WHERE _id=${req.params.id}`) 
        res.status(200).end()
    })
})



module.exports = router;