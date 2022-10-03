const Book = require("../models/Book.model");

const router = require("express").Router();


router.get("/books", (req, res, next) => {
  //whenever anyone goes here we want to send a query to the database so we do ...
  Book.find() //this will return a promise, if it's successful we'll receive the list of books and then we'll console log it!
  .then(booksfromDB => {
    //res.render needs to go through an object, which stores the values of our found books
    res.render("books/books-list", {books: booksfromDB})
  })
  //if it's unsuccessful we'll get an error and we'll console log it 
  .catch(err=> console.log('there was an error', err))
});

module.exports = router;
