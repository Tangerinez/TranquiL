var profiles = require("../public/user-profiles");

// module.exports = function app() {
//   app.get("api/assessment", function(req, res) {
// res.json(profiles);
//   });

//   app.post("api/assessment", function(req, res) {
// var userInput = req.body;
// profiles.push(userInput);

function scoreCalculator(profiles) {
  // We itterate through the profiles and capture
  for (let i = 0; i < profiles.length; i++) {
    var currentUser = profiles[i];
    console.log({ currentUser });
    var score = 0;
  }
  for (let j = 0; j < currentUser.data.length; j++) {
    score += currentUser.data[j];
  }
  console.log({ score });
  assessment(currentUser, score);
}

scoreCalculator(profiles);

function assessment(userInput, score) {
  console.log({ userInput });
  console.log(userInput.category);
  // create cases where we check the scores with the corresponding database tables
  // each case will start a function that will return a random input video in the category set in the switch case
  switch (userInput.category) {
    case "meditation":
      // set a function to work out a random meditation video in the stress level coming from the score
      meditation(score);
      break;
    case "yoga":
      // set a function to work out a random yoga video in the stress level coming from the score
      yoga(score);
      break;
    case "exercise":
      //   set a fucntion to work out a random exercise video in the stress level coming from the score
      exercise(score);
      break;
  }
}

// this function takes the score and then
function meditation(data) {
  console.log(data);
}

function yoga(data) {
  console.log(data);
}

function exercise(data) {
  console.log(data);
}
//   });
// };
