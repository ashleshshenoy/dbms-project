
const express = require('express');
const router = express.Router();
const {sql , con } = require('../db/db')
const auth = require('../../middleware/auth');


router.get('/', auth, async (req, res)=>{
    // retrieves the profiles subscribed by the logged in user.
    con.query(`SELECT _pid, username, image_url FROM subscription s, profile p WHERE s._sid=${req.user._id} and s._pid = p._id` , (error , result, fields)=>{
        res.status(200).send(result);
    })
})

router.get('/is/:id', auth, async (req, res)=>{
    // retrieves the profiles subscribed by the logged in user.
    con.query(`SELECT * from subscription  WHERE _sid=${req.user._id} and  _pid=${req.params.id}` , (error , result, fields)=>{
        console.log(error);
        isSubscribed = (result.length > 0)? true : false;
        res.status(200).send({isSubscribed: isSubscribed});
        
    })
})


router.get('/subscribe/:id', auth, async (req, res)=>{
    con.query(`SELECT * FROM subscription where _pid=${req.params.id} and _sid =${req.user._id}`, (err, result, fields)=>{
    if(result.length > 0 ) return res.status(404).send("subscription already exist");
    // subscribes the logined in user to the profile id in params
    con.query(`INSERT INTO subscription values(${req.params.id},${req.user._id});`, (error, result, fields)=>{
        res.status(200).send("Successfully subscribed to profile _id " + req.params.id);
    })
    })
    
});


router.delete('/subscribe/:id',auth, async (req, res)=>{
    // unsubscribes the logined in user to the profile id in params
    con.query(`DELETE FROM subscription WHERE _pid = ${req.params.id} and _sid=${req.user._id};`, (error, result, fields)=>{
        if(result.affectedRows < 0) res.status(404).send("The profile doesnt exist");
        res.status(200).send("Successfully subscribed to profile _id " + req.params.id);
    })
});



module.exports = router;