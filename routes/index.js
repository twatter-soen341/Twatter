const express = require('express')
const router = express.Router();
const Person = require('../models/person')

router.get('/', (req, res) => {
    res.render('main.ejs')
})

router.post('/person', (req, res) => {
    
    const newPerson = new Person({
        'name': req.body.name,
        'age': parseInt(req.body.age)
    });

    newPerson.save((err)=>{
        if (err) console.log(err.status)
    });

    res.redirect('/')
})

module.exports = router;