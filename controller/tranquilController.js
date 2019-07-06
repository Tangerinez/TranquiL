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
  // we grab the last user from the user_info table
  var check = true;
  userInfo.all(function(result) {
    // we store it into a container
    var user = result.pop();
    console.log(user.meditationvid);
    console.log(user.exercisevid);
    if (user.meditationvid !== null && user.exercisevid !== null) {
      check = false;
      console.log(check);
      renderPage(user);
    } else {
      // We grab the video's from the data_output table
      dataOutput.all(function(result) {
        // We set both the values as parameters for our invoked function so we can manipulate the data for our own use
        renderResult(user, result);
      });
    }
  });

  // We create the function with parameters
  function renderResult(user, result) {
    // We check the current user's score (last Id in the list)
    var userScore = user.score;

    // We create empty arrays to store the video id's into
    var meditation = [];
    var exercise = [];
    var description = [];

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
        description.push(result[i].description);
      }
    }

    // We randomly select one of the meditation and one of the exercise video
    var medRandom = Math.floor(Math.random() * meditation.length);
    var exerRandom = Math.floor(Math.random() * meditation.length);

    // Store those in containers
    var medId = meditation[medRandom];
    var descId = description[medRandom];
    var exeId = exercise[exerRandom];

    // This is the current users id
    var id = user.id;

    var hbsobj = {
      description: descId,
      meditation: medId,
      exercise: exeId,
      user: user
    };

    // and into the user_info table so that they are connected to the user
    // This is for reusability of the video's when the user log's back in
    userInfo.update(
      { meditationvid: medId, exercisevid: exeId },
      ["id =" + id],
      function(result) {
        // console.log({ result });
        renderPage(hbsobj);
      }
    );

    console.log(hbsobj);
    // console.log(user);
  }
  // We store all the info we want to send off to the HTML/Handlebars page in an object

  // We render the page with the object in it.
  function renderPage(hbsobj) {
    if (check) {
      console.log("I'm running");
      // console.log({ hbsobj });
      res.render("result", hbsobj);
    } else {
      console.log("me running");
      var hbsobj = {
        meditation: hbsobj.meditationvid,
        exercise: hbsobj.exercisevid,
        user: hbsobj
      };
      console.log({ hbsobj });
      res.render("result", hbsobj);
    }
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
        }
      );
      res.status(200).end();
    } else if (userProfile.name === "") {
      var error = "Please enter your name";
      res.send([error]);
    } else if (userProfile.userId === "") {
      var error = "Please enter a userId";
      res.send([error]);
    } else if (
      existingUsernamesArray.includes(userProfile.userId) === true &&
      userProfile.password.length >= 8 &&
      userProfile.password.length <= 20
    ) {
      var error = "This userId is already taken. Please enter another userId.";
      res.send([error]);
    } else if (
      existingUsernamesArray.includes(userProfile.userId) === false &&
      (userProfile.password.length < 8 || userProfile.password.length > 20)
    ) {
      var error = "Your password is an invalid length.";
      res.send([error]);
    }
  });
});

router.post("/api/login", function(req, res) {
  // User Login Authentication
  // ----------------------------------------------------------------------
  var userProfile = req.body;
  console.log("userprofile" + userProfile);

  userInfo.all(function(response) {
    var existingUsernamesArray = [];
    var existingPasswordsArray = [];
    var currentUser = [];
    var object = {
      data: response
    };
    var registerInfo = object.data;
    console.log({ registerInfo });
    // console.log(JSON.stringify(object));

    for (var i = 0; i < registerInfo.length; i++) {
      existingUsernamesArray.push(registerInfo[i].username);
      existingPasswordsArray.push(registerInfo[i].password);
    }
    console.log("existing users" + existingUsernamesArray);
    for (var i = 0; i < existingUsernamesArray.length; i++) {
      if (
        userProfile.userId === existingUsernamesArray[i] &&
        userProfile.password === existingPasswordsArray[i]
      ) {
        console.log("password match");
        currentUser.push(response[i]);
        console.log(currentUser[0].name);
        var idCount = registerInfo.pop().id;
        idCount += 1;
        console.log(idCount);
        userInfo.update(
          { id: idCount },
          ["name = " + "'" + currentUser[0].name + "'"],
          function(res) {
            console.log(res);
          }
        );
        res.status(200).end();
      } else if (
        existingUsernamesArray.includes(userProfile.userId) === false
      ) {
        var error = "userId does not exist";
        return res.send(error);
      } else if (
        userProfile.userId === existingUsernamesArray[i] &&
        userProfile.password !== existingPasswordsArray[i]
      ) {
        var error = "Incorrect password. Please try again";
        return res.send(error);
      }
    }
  });
});

//GReg and Lucs codebelow//

//   let count = 0;

//   function renderResult(currentUser) {
//     console.log(currentUser);
//     var profile = {
//       currentUser: currentUser
//     };
//     res.render("result", profile);
//   }
//   userInfo.all(function(res) {
//     var existingUsernamesArray = [];
//     var existingPasswordsArray = [];
//     var currentUser = [];
//     for (var i = 0; i < res.length; i++) {
//       existingUsernamesArray.push(res[i].username);
//       existingPasswordsArray.push(res[i].password);
//     }
//     for (var i = 0; i < existingUsernamesArray.length; i++) {
//       if (
//         userProfile.userId === existingUsernamesArray[i] &&
//         userProfile.password === existingPasswordsArray[i]
//       ) {
//         currentUser.push(res[i].name);
//         currentUser.push(res[i].meditationvid);
//         currentUser.push(res[i].exercisevid);
//         renderResult(currentUser);
//       } else {
//         var error = "userId does not match password. Please try again";
//         // res.send([error]);
//         count++;
//       }
//     }
//     currentUser.push(count);
//     // console.log(res);
//   });
// });
// ----------------------------------------------------------------------
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

  // This updates the user score to the users info in the database
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
