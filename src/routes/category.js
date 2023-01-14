
const express = require('express');
const router = express.Router();
const {sql , con } = require('../db/db')
const auth = require('../../middleware/auth');


router.get('/', async (req, res) =>{
    // returns list of available category
    con.query(`SELECT * FROM category;`, (error , result ,fields)=>{
        res.status(200).send(result);
    })
})


router.get('/:id', async (req, res) =>{
    // returns the category detail of specified id
    con.query(`SELECT * FROM category WHERE _id='${req.params.id}';`, (error, result , fields)=>{
        if(result.length == 0) return res.status(404).send("No such category with id " + req.params.id)
        res.status(200).send(result[0]);

    })
})

router.post('/', async (req, res) =>{
    // creates a new category 
    con.query(`SELECT * FROM category WHERE name='${req.body.name}';`, (error , result, fields)=>{
        if(result.length !=0) return res.status(409).send("category with same name already exists");
    });
    con.query(`INSERT INTO category(name, description) VALUES('${req.body.name}', '${req.body.description}');`
    ,(error, result, fields)=>{
        res.status(201).send("succesfully created new category " + result.insertId);
    })

})


router.patch('/:id' , async (req, res) =>{
    // updates category details of specified id
    con.query(`SELECT * FROM category WHERE _id !='${req.params.id}' and name='${req.body.name}'`, (error, result, fields)=>{
        if(result.length != 0) return res.status(409).send("Category with similar name already exists, try different name");
    })
    con.query(`UPDATE category SET name='${req.body.name}', description='${req.body.description}' where _id = '${req.params.id}';`, (error, result, fields)=>{
        if(error) return res.send(error);
        console.log("success");
        res.status(200).send("successfully updated category " + req.params.id)
    })
})


router.delete('/:id', async (req, res)=>{
    // details a category of specified id
    con.query(`DELETE FROM category WHERE _id = '${req.params.id}';`, (error, result, fields)=>{
        if(result.affectedRows < 1) return res.status(404).send("No such category with id " + req.params.id);
        res.status(200).send("successfully deleted category " + req.params.id)
    });
})


module.exports = router;