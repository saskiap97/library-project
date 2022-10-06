const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");

const saltRounds =10;

//route to display a create account form
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});


//route to process the signup form
router.post("/signup", (req, res, next) => {
    const {password,email} = req.body

    bcryptjs
    .genSalt(saltRounds)
    .then(salt => {
        return bcryptjs.hash(password, salt)
    })
    .then((hash) => {
        const userDetails = {
            email, //:email
            passwordHash: hash
        }
        return User.create(userDetails);
    })
    .then(userFromDB => {
        res.redirect("/");
    })
    .catch(e => {
        console.log("error creating account", e)
        next(e);
    });

});


//route to display login form page
router.get("/login", (req, res, next) => {
    res.render("auth/login");
});

//LOGIN: process form
router.post("/login", (req, res, next) => {
    
    const {email, password} = req.body; //get password and email from body of requests

    if (!email || !password) { //backend validation - if in the body we dont receive email or password we will render the page below
        res.render('auth/login', { errorMessage: 'Please enter both, email and password to login.' });
        return; //if we do this if statement, we finish the function with the return statement (because we cant do any of the below)
    }


    User.findOne({email: email}) // go to db and find a document where the field email is equal to what we got from req.body
        .then( userFromDB => { // here we receive an object of the document with the matching user from the DB 
            if(!userFromDB){ //if there's no user with that email address then we end up in this if statement
                res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
                return;
            } else if (bcryptjs.compareSync(password, userFromDB.passwordHash)) { //go to bcrypt and ask if we have in our db a password (from req.body) that matches our passwordHash in db

                //login sucessful
                req.session.currentUser = userFromDB //this tells the browser to initialise a session and store a cookie ?
                res.render('users/user-profile', { userInSession: req.session.currentUser });
            } else {
                //login failed
                res.render('auth/login', { errorMessage: 'Incorrect credentials.' });
            }
        })
        .catch(error => { //if the findOne fails then we end up in the catch
            console.log("Error getting user details from DB", error)
            next(error);
        });
});

router.get('/user-profile', (req, res) => {

    res.render('users/user-profile', { userInSession: req.session.currentUser });

    //res.render('users/user-profile');
    // res.render('users/user-profile', { userInSession: req.session.currentUser });
});

module.exports = router;