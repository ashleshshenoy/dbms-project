
const express = require('express');
const router = express.Router();
const {sql , con } = require('../db/db')
const auth = require('../../middleware/auth');


router.get('/', async (req, res)=>{
    // retrieves the profiles subscribed by the logged in user.
    con.query(`SELECT * FROM subscription WHERE _sid='${req.user._id}'` , (error , result, fields)=>{
        res.status(200).send(result);
    })
})


router.get('/subscribe/:id', async (req, res)=>{
    // subscribes the logined in user to the profile id in params
    con.query(`INSERT INTO subscription values('${req.params.id}','${req.user._id}');`, (error, result, fields)=>{
        if(result.affectedRows < 0) res.status(404).send("The profile doesnt exist");
        res.status(200).send("Successfully subscribed to profile _id " + req.params.id);
    })
});


router.delete('/subscribe/:id', async (req, res)=>{
    // unsubscribes the logined in user to the profile id in params
    con.query(`DELETE FROM subscription WHERE _pid = '${req.params.id}' and _sid='${req.user._id}';`, (error, result, fields)=>{
        if(result.affectedRows < 0) res.status(404).send("The profile doesnt exist");
        res.status(200).send("Successfully subscribed to profile _id " + req.params.id);
    })
});



module.exports = router;