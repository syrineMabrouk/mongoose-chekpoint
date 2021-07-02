const express = require('express');
const router = express.Router();
const Person = require('../models/PersonSchema');

//Create and Save a Record of a Model
router.post('/NewPerson', (req,res) => {
    const newPerson = new Person(req.body)
    newPerson
    .save()
    .then(() => res.send('Record saved'))
    .catch(err => res.status(400).json(err.message))

})

//creation de model
var createManyPeople = function(arrayOfPeople, done) {
    Person.create( arrayOfPeople, (err, data) => err ? console.log(err) : done(null, data));
  }; 
  
  router.post('/ManyPersons',(req,res)=> {
  createManyPeople (req.body,(err,data)=> { 
    err ?  console.log(err) : res.send('ManyPerson was created')
  })  
  })

 
  router.get('/:name', (req, res)=> {
      Person.find({name: req.params.name},(err,data)=> err? console.log(err) : res.json(data))
  })


router.get('/getFavorite/:favoriteFoods',(req, res)=> {
  Person.findOne({favoriteFoods : req.params.favoriteFoods},(err,data)=> err? console.log(err) : res.json(data))
})

router.get('/getPerson/:personId', (req, res)=>{
  Person.findById({_id: req.params.personId},(err,data)=> err? console.log(err) : res.json(data))
})


var findEditThenSave = function(personId, done) {
  const itemToAdd = 'hamburger'
  const person = Person.findById({_id: personId}, function(err, data){
    if (err) {
      return done(err)}
    data.favoriteFoods.push(itemToAdd)
    data.save((err, data)=>{
      if (err) {
        return done(err)}
      else {
        return done(null, data)}
    })
  })
}

router.put('/:id', (req, res)=>{
  findEditThenSave(req.params.id, (err,data)=> err? console.log(err) : res.send('Person found was updated'))
})

router.put('/getName/:name',(req,res)=>{
  Person.findOneAndUpdate({name: req.params.name},{$set:{age:20}},{new:true},(err,data)=>
  err? console.log(err) : res.json(data))
})


router.delete('/:PersonID',(req,res)=>{
  Person.findByIdAndRemove(req.params.PersonID,(err,data)=>err? console.log(err) : res.send('Person is deleted'))
})


router.delete('/deletedName/:name',(req,res)=> {
  Person.remove({ name:req.params.name},(err,data)=> { 
    err ?  console.log(err) : res.send('all persons named Mary were deleted')
  })   
})


router.get('/',(req,res)=>{
  Person.findOne({favoriteFoods:"pizza"}) 
  .sort({name:"desc"})
  .limit(2)
  .select("-age")
  .exec((err,data)=>err? console.log(err) : res.json(data))
})


module.exports= router