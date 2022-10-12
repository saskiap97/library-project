// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

//config sessions
require('./config/session.config')(app);

// default value for title local
const capitalized = require("./utils/capitalized");
const projectName = "library-project";

app.locals.appTitle = `${capitalized(projectName)} created with IronLauncher`;

app.use((req,res,next)=>{
    res.locals.userInSession = req.session.currentUser
    next(); //call next middleware func 
})

//app.use([path,] callback [, callback...])

const isLoggedIn=  (req, res, next) => {
    if(req.session.currentUser){
        next();
    } else {
        res.redirect("/login")
    }
}
//the function above works by if we go to create a book, it checks if we have a user in our req.session (someone is logged in)
//if we do, then we continue the functions that are in the create user route (next)
//if we don't, then we redirect them to the login page 

//app.use("/books/create", isLoggedIn)



// 👇 Start handling routes here
const index = require("./routes/index.routes");
//mount with app dot use on the route path
app.use("/", index);

//two ways of adding routes
const bookRoutes = require("./routes/book.routes");
app.use('/', bookRoutes);

app.use("/",  require("./routes/author.routes"))

app.use('/', require("./routes/auth.routes"));
//mount on top of the route path the content of this file! 
//we can put multiple middleware funcs in the app.use
// so we can do 
//app.use('/', isLoggedIn, require("./routes/author.routes"));


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
