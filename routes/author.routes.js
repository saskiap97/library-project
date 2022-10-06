const Book = require("../models/Book.model");
const Author = require("../models/Author.model");

const router = require("express").Router();

//list all authors
router.get("/authors", (req,res,next)=>
Author.find()
.then(foundAuthors => res.render('authors/author-list', {authors: foundAuthors}))
.catch(err => console.log(err))
)


//CREATE: display form
router.get("/authors/create", (req, res, next) => {
    res.render('authors/author-create');
  });
  

//process the form

router.post("/authors/create", (req, res, next) => {
const authorDetails = {
    name: req.body.name,
    age: req.body.age,
    country: req.body.country
}

Author.create(authorDetails)
.then((createdAuthor)=> {res.redirect('/authors');
console.log('created', createdAuthor)})
.catch((err)=> {console.log(err)})


})

module.exports = router;