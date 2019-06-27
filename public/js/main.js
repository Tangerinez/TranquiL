$(document).ready(function() {
  $(".modal").modal();
  console.log("this works.");

  // When we press the button to submit the registration form
  $("button[name=action]").on("click", function() {
    // we make sure that we prevent its default setting
    event.preventDefault();

    // we create an object which we hold all the user info
    var userInfo = {
      name: $("input[id=input-username]")
        .val()
        .trim(),
      userId: $("input[id=input-userID]")
        .val()
        .trim(),
      password: $("input[id=input-password]")
        .val()
        .trim()
    };

    // we check, check and double check that we get the right info back.
    console.log({ userInfo });

    // We send the information object off to the server
    $.post("/api/registration", userInfo).then(function(data) {
      // We check whatever the server sends back to us
      console.log(data);

      //we relocate the page to a new route, in this case the survey page
      window.location.replace("/survey");
    });
  });
});
