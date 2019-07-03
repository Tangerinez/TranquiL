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
// Yipiekayeey MF
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
// router.get("/result", function(req, res) {
//   res.sendFile(path.join(__dirname, "../views/results.html"));
// });

router.get("/data-output", function(req, res) {
  res.sendFile(path.join(__dirname, "../views/addvideo.html"));
});

// We set the route to our results page
router.get("/result", function(req, res) {
  // we grab the last user from the user_info table
  userInfo.all(function(result) {
    // we store it into a container
    var user = result.pop();

    // We grab the video's from the data_output table
    dataOutput.all(function(result) {
      // We set both the values as parameters for our invoked function so we can manipulate the data for our own use
      renderResult(user, result);
    });
  });

  // We create the function with parameters
  function renderResult(user, result) {
    // We check the current user's score (last Id in the list)
    var userScore = user.score;

    // We create empty arrays to store the video id's into
    var meditation = [];
    var exercise = [];

    // we run through all the data in the data_output table (the video's)
    for (let i = 0; i < result.length; i++) {
      // We grab the minimal and maximum scores for each of the video's
      var min = result[i].min;
      var max = result[i].max;

      // We check whether the users score is inbetween the min and max of any of the video's
      if (userScore >= min && userScore <= max) {
        // We then store the video's that match the userscore into a mediation and exercise container
        meditation.push(result[i].meditation);
        exercise.push(result[i].exercise);
      }
    }

    // We randomly select one of the meditation and one of the exercise video
    var medRandom = Math.floor(Math.random() * meditation.length);
    var exerRandom = Math.floor(Math.random() * meditation.length);

    // Store those in containers
    var medId = meditation[medRandom];
    var exeId = exercise[exerRandom];

    // This is the current users id
    var id = user.id;

    // and into the user_info table so that they are connected to the user
    // This is for reusability of the video's when the user log's back in
    userInfo.update(
      { meditationvid: medId, exercisevid: exeId },
      ["id =" + id],
      function(result) {
        console.log({ result });
      }
    );

    // We store all the info we want to send off to the HTML/Handlebars page in an object
    var hbsobj = {
      description: result.description,
      meditation: medId,
      exercise: exeId,
      user: user
    };
    // We render the page with the object in it.
    res.render("result", hbsobj);
  }
});
// API ROUTES
// ----------------------------------------------------------------------
// This is the post request for the registration
router.post("/api/registration", function(req, res) {
  var userProfile = req.body;
  console.log("in the post route");
  console.log(req.body);
  console.log("userProfile" + userProfile);
  userInfo.all(function(response) {
    var existingUsernamesArray = [];
    var object = {
      data: response
    };
    var registerInfo = object.data;
    console.log(JSON.stringify(object));
    for (var i = 0; i < registerInfo.length; i++) {
      existingUsernamesArray.push(registerInfo[i].username);
    }
    console.log(existingUsernamesArray);
    console.log(typeof userProfile.name);
    console.log("this is the name of the user " + userProfile.name);
    console.log("length of password " + userProfile.password.length);
    if (
      existingUsernamesArray.includes(userProfile.name) === false &&
      userProfile.password.length >= 8 &&
      userProfile.password.length <= 20
    ) {
      // ----------------------------------------------------------------------
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
      // User Registration Authentication
      // ----------------------------------------------------------------------
    }
  });
});

//   );
//   // ROUTE TO SURVEY PAGE
//   // The route goes to the survey since username and password pass the criteria
// } else if (
//   existingUsernamesArray.includes(userInfo.userId) === true &&
//   (userInfo.password.length >= 8 && userInfo.password.length <= 20)
// ) {
//   res.send(["THIS USERNAME IS ALREADY TAKEN. PLEASE ENTER ANOTHER USERNAME"]);
//   // $(".password-length-wrong").remove();
//   // $(".existing-username-text").remove();
//   // let wrongUsernameContainer = $("<small>");
//   // wrongUsernameContainer.addClass(
//   //   "form-text text-muted existing-username-text"
//   // );
//   // wrongUsernameContainer.text(
//   //   "This username is already taken. Please enter another username."
//   // );
//   // $(".userId-div").append(wrongUsernameContainer);
// } else if (
//   existingUsernameArray.includes(userInfo.userId) === false &&
//   (userInfo.password.length < 8 || userInfo.password.length > 20)
// ) {
//   res.send(["Your password is an invalid length!"]);
//   // $(".existing-username-text").remove();
//   // $(".password-length-wrong").remove();
//   // let invalidPasswordContainer = $("<small>");
//   // invalidPasswordContainer.addClass(
//   //   "form-text text-muted password-length-wrong"
//   // );
//   // invalidPasswordContainer.text("Your password is an invalid length!");
//   // $("password-signup-div").append(invalidPasswordContainer);
// } else if (
//   existingUsernamesArray.includes(userInfo.userId) === true &&
//   (userInfo.password.length < 8 || userInfo.password.length > 20)
// ) {
//   res.send([
//     "This username is already taken. Please go bo back to the login screen or use a different username.",
//     "Your password is an invalid length!"
//   ]);
//   // if there is already an existing username
//   // $(".existing-username-text").remove();
//   // $(".password-length-wrong").remove();
//   // let wrongUsernameContainer = $("<small>");
//   // wrongUsernameContainer.addClass(
//   //   "form-text text-muted existing-username-text"
//   // );
//   // wrongUsernameContainer.text(
//   //   "This username is already taken. Please go bo back to the login screen or use a different username."
//   // );
//   // $(".userId-div").append(wrongUsernameContainer);
//   // var invalidPasswordContainer = $("<small>");
//   // invalidPasswordContainer.addClass(
//   //   "form-text text-muted password-length-wrong"
//   // );
//   // invalidPasswordContainer.text("Your password is an invalid length!");
//   // $(".password-signup-div").append(invalidPasswordContainer);
// }

router.post("/api/login", function(req, res) {
  // User Login Authentication
  // ----------------------------------------------------------------------
  var userProfile = req.body;
  let count = 0;
  userInfo.all(function(res) {
    var existingUsernamesArray = [];
    var existingPasswordsArray = [];
    var currentUser = [];

    for (var i = 0; i < res.length; i++) {
      existingUsernamesArray.push(res[i].username);
      existingPasswordsArray.push(res[i].password);
    }

    for (var i = 0; i < existingUsernamesArray.length; i++) {
      if (
        userProfile.userId === existingUsernamesArray[i] &&
        userProfile.password === existingPasswordsArray[i]
      ) {
        console.log("PLEASE PUT CODE HERE");
        currentUser.push(res[i].name);
        currentUser.push(res[i].videoLink1);
        currentUser.push(res[i].videoLink2);
        var profile = {
          currentUser: currentUser
        };
        res.render("result", profile);
      } else {
        count++;
      }
    }
    currentUser.push(count);
    console.log(res);
  });

  // if (count === existingUsernamesArray.length) {
  //   $(".wrong-loginInfo-text").remove();
  //   var loginErrorContainer = $("<small>");
  //   loginErrorContainer.addClass("form-text text-muted wrong-loginInfo-text");
  //   loginErrorContainer.text(
  //     "Your username and/or password information are incorrect. Please try again."
  //   );
  //   $(".password-div").append(loginErrorContainer);
  // }
});
// ----------------------------------------------------------------------
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
