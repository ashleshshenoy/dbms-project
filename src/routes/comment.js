
const express = require('express');
const router = express.Router();
const { sql, con } = require('../db/db')
const auth = require('../../middleware/auth');

router.post('/', auth, function (req, res) {
    console.log(req.body)
    con.query(`INSERT INTO comment(_vid, _pid , comment) VALUES(${req.body._vid} , ${req.user._id}, '${req.body.comment}')`, (err, result, field) => {
        console.log(result);
        res.send(result)
    })

})


router.get('/:id', function (req, res) {
    con.query(`SELECT c.comment , p.image_url , p.username   FROM comment c, profile p WHERE _vid=${req.params.id} and c._pid=p._id order by c._id DESC`, (err, result) => {
        console.log(err)
        res.send(result);
    })
});


module.exports = router;