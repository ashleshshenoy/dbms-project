
const express = require('express');
const router = express.Router();
const {sql , con } = require('../db/db')
const auth = require('../../middleware/auth');


// add like  + increment like count
// remove like + decrement like count

router.get('/:id', auth ,(req, res)=>{
    con.query(`INSERT INTO video_like VALUES('${new Date().toISOString().slice(0, 19).replace('T', ' ')}', ${req.params.id}, ${req.user._id} )`,
        (error,result, fields)=>{
            if (error)  return res.end("like already exists");
        }
    )
    con.query(`DELETE FROM video_dislike WHERE _pid=${req.user._id} and _vid=${req.params.id}`,
    (error, result, fields)=>{
        if(result.affectedRows > 0) 
            con.query(`UPDATE video SET like_count = like_count + 1 , dis_count = dis_count - 1  WHERE _id=${req.params.id}`);
            con.query(`UPDATE video SET like_count = like_count + 1  WHERE _id=${req.params.id}`);
            res.status(200).send("successfully added the like ")
    })

})

router.delete('/:id', auth, (req, res)=>{
    con.query(`DELETE from video_like WHERE _vid=${req.params.id};`, (error, result, fields)=>{
        res.status(200).send(" deleted the like ")
    })
})

module.exports = router;