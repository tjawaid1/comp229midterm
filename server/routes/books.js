// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let Book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  
  // find all books in the books collection
  Book.find((err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {

  // Initializing an empty book object
  let book = {
    Title: "",
    Description: "",
    Price: "",
    Author: "",
    Genre: ""
  };

  res.render('books/details', {
    title: 'Book Details',
    books: book
  });


});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {


  // Instantiating the Book model object
  let book = new Book();

  book.Title = req.body.Title;
  book.Description = req.body.Description;
  book.Price = req.body.Price;
  book.Author = req.body.Author;
  book.Genre = req.body.Genre;

  book.save(function (error, results) {
    if (error) {
      return next(error);
    }
    // Redirecting to the books index
    res.redirect("/books");
  });

});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {
  let id = req.params.id;

  // Finding the book object using ID
  Book.findOne({
    _id: id
  }).populate('Book').exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // If valid user was not found, send 404
    if (!results) {
      res.status(404).send('No Record Found');
    }
    else {
      res.render('books/details', {
        title: 'Book Details',
        books: results
      });


    }
  });
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {
  let id = req.params.id;

  // Finding the book object using ID and updating it
  Book.findOneAndUpdate(
    {
      _id: id
    },
    {
      Title: req.body.Title,
      Description: req.body.Description,
      Price: req.body.Price,
      Author: req.body.Author,
      Genre: req.body.Genre
    },
    function (error, results) {
      if (error) {
        return next(error);
      }
      // Redirecting to the books index
      res.redirect("/books");
    });

});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {
  let id = req.params.id;

  // Finding the book object using ID and deleting it
  Book.deleteOne({ _id: id }, function (error, results) {
    if (error) {
      return next(error);
    }
    // If valid user was not found, send 404
    if (!results) {
      res.status(404).send('No Record Found');
    }
    else {
      // Redirecting to the books index
      res.redirect("/books");

    }
  });

});


module.exports = router;
