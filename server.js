// We require express and initialize it
var express = require("express");

var app = express();

// We create a PORT
PORT = process.env.PORT || 8080;

// We use middleware to use css and javascript on our html pages
// The server will have its route directory in app/public/
app.use(express.static("public"));

// We use a this code to parse code into json format
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// We require our controller
var routes = require("./controller/tranquilController");

// we link the router to our express
app.use(routes);

app.listen(PORT, function() {
	console.log("Server listening at https://localhost:" + PORT);
});
