
const express = require('express');
const router = express.Router();
const {sql , con } = require('../db/db')
const auth = require('../../middleware/auth');


// add dislike  + increment like count
// remove dislike + decrement like count

router.get('/:id', auth ,(req, res)=>{
    con.query(`INSERT INTO video_dislike VALUES('${new Date().toISOString().slice(0, 19).replace('T', ' ')}', ${req.params.id}, ${req.user._id} )`,(error,result, fields)=>{
        con.query(`DELETE FROM video_like WHERE _pid=${req.user._id} and _vid=${req.params.id}`,(error, result, fields)=>{
            if(result.affectedRows > 0) 
                con.query(`UPDATE video SET dis_count = dis_count + 1 ,like_count = like_count - 1 WHERE _id=${req.params.id}`,(err, result)=>{
                    res.status(200).send("successfully added the like ")
                })
            else 
                con.query(`UPDATE video SET dis_count = dis_count + 1  WHERE _id=${req.params.id}`,(err, result)=>{
                    res.status(200).send("successfully added the like ")
                });
        })        
    })
})

router.delete('/:id', auth, (req, res)=>{
    con.query(`DELETE from video_dislike WHERE _vid=${req.params.id};`, (error, result, fields)=>{
        con.query(`UPDATE video SET dis_count = dis_count - 1 WHERE _id=${req.params.id}`,(err, result)=>{
            res.status(200).send(" deleted the like ")
        });   
    })
})

module.exports = router;