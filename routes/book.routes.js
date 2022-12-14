const Book = require("../models/Book.model");
const Author = require("../models/Author.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const router = require("express").Router();

router.get("/books", (req, res, next) => {
  //whenever anyone goes here we want to send a query to the database so we do ...
  Book.find()
  .populate('author') //this will return a promise, if it's successful we'll receive the list of books and then we'll console log it!
  .then(booksfromDB => {
    //res.render needs to go through an object, which stores the values of our found books
    res.render("books/books-list", {books: booksfromDB})
  })
  //if it's unsuccessful we'll get an error and we'll console log it 
  .catch(err=> console.log('there was an error', err))
});


//Book details
router.get("/books/:bookId", (req, res, next) => {
    const id = req.params.bookId;
    console.log(req.params);
  
    Book.findById(id)
    .populate('author')
      .then( bookDetails => {
        res.render("books/book-details", bookDetails)
      } )
      .catch( err => {
        console.log("error getting book details from DB", err);
        next();
      })
  });

//Create a route to display a form

router.get("/books/create", isLoggedIn, (req, res, next) => {
  Author.find()
    .then( (authorsFromDB) => {
      res.render("books/book-create", {authorsArr: authorsFromDB});
    })
    .catch(err => {
      console.log("error getting authors from DB", err);
      next(err);
    })
})


//Create a route to process form info 

router.post("/books/create", isLoggedIn, (req, res, next) => {
  
    const bookDetails = {
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
      rating: req.body.rating,
    }

    Book.create(bookDetails)
      .then(bookDetails => {
        res.redirect("/books")
      })
      .catch(err => {
        console.log("error creating new book in DB", err);
        next();
      })
  
  })
  


//UPDATE: display form
router.get("/books/:bookId/edit", (req, res, next) => {
    Book.findById(req.params.bookId)
      .then( (bookDetails) => {
        res.render("books/book-edit", bookDetails);
      })
      .catch( err => {
        console.log("Error getting book details from DB...", err);
        next();
      });
  });
  

//UPDATE: process form
router.post("/books/:bookId/edit", (req, res, next) => {
  const bookId = req.params.bookId;

  const newDetails = {
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    rating: req.body.rating,
  }

  Book.findByIdAndUpdate(bookId, newDetails)
    .then(() => {
      res.redirect(`/books/${bookId}`);
    })
    .catch(err => {
      console.log("Error updating book...", err);
      next();
    });
});

//DELETE
router.post("/books/:bookId/delete", (req, res, next) => {
  Book.findByIdAndDelete(req.params.bookId)
    .then(() => {
      res.redirect("/books");
    })
    .catch(err => {
      console.log("Error deleting book...", err);
    });

});



module.exports = router;
