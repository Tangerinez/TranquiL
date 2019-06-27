// We require both the models
var userInfo = require("../models/user_info");
var dataOutput = require("../models/data_output");

var path = require("path");
// We require the express module
var express = require("express");

// We require the Router method from express
var router = express.Router();

var id = [];
// HTML ROUTES
// ----------------------------------------------------------------------

// WORKING ROUTES
// We set the route for our home page
router.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../views/main.html"));
});

// We set the route for our survey page
router.get("/survey", function(req, res) {
  res.sendFile(path.join(__dirname, "../views/survey.html"));
});

// We set the route to our results page
router.get("/result", function(req, res) {
  res.sendFile(path.join(__dirname, "../views/results.html"));
});

// TEST ROUTES
// router.get("/", function(req, res) {
//   res.sendFile(path.join(__dirname, "../test-pages/test-main.html"));
// });

// // We set the route for our survey page
// router.get("/survey", function(req, res) {
//   res.sendFile(path.join(__dirname, "../views/test_survey.html"));
// });

// // We set the route to our results page
// router.get("/result", function(req, res) {
//   res.sendFile(path.join(__dirname, "../views/results.html"));
// });
// API ROUTES
// ----------------------------------------------------------------------

// This is the post request for the registration
router.post("/api/registration", function(req, res) {
  var userProfile = req.body;
  console.log(userProfile);

  // Here we connect to the database using the ORM and sending all the data to the table
  userInfo.create(
    ["username", "password", "name"],
    [userProfile.userId, userProfile.password, userProfile.name],
    function(result) {
      // We get back the ID of the user so we can match the score from the survey with the username password
      id = result.insertId;
      console.log({ id });
      res.json(id);
    }
  );
});

router.post("/api/login", function(req, res) {});
// We run logic to calculate the user score and push it into the database
router.post("/api/survey", function(req, res) {
  // we capture the user input from the html file
  var userInput = req.body;
  console.log(userInput);

  // This function calculates the score of the user
  function scoreCalculator(userInput) {
    var score = 0;
    for (let i = 0; i < userInput.data.length; i++) {
      score += parseInt(userInput.data[i]);
    }
    // it pushes it to the database
    postToDatabase(score);
  }

  // I have to figure out a way to retrieve the ID of the username and password posted in the registration
  // so we can link the score to the same row
  function postToDatabase(score) {
    userInfo.all(function(data) {
      id = data.pop().id;
      userInfo.update({ score: score }, ["id =" + id], function(result) {
        console.log({ result });
        if (result.affectedRows > 0) {
          res.json(result);
        } else {
          res.status(500).end();
        }
      });
    });
    console.log({ score });
    // I have to change this to an userInfo.update and then use the ID of the user that I get as a result from /api/registration
  }
  scoreCalculator(userInput);
});

module.exports = router;