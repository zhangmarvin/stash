window.onload = window.onresize = function() {
    var intro = document.getElementById("introbox");
    if (window.innerHeight < intro.clientHeight) {
        intro.style.marginTop = "1em";
    } else {
        intro.style.marginTop = ((window.innerHeight - intro.clientHeight)/2) + "px";
    }
}

function updateMessage(msg) {
    document.getElementById("message").innerHTML = msg;
}

function loginSuccess(data) {
    data = $.parseJSON(data);
    if (data.success == 1) {
        console.log("Logged in successfully!");
        window.location.href = '/user/';
    } else {
        console.log("Error: " + data.reason);
        switch (data.reason) {
        case "bad password":
            updateMessage("You entered the wrong password. Please try again!");
            break;
        case "no account":
            updateMessage("You entered an invalid username. Did you mean to sign up?");
            break;
        }
    }
}

function submitLogin() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    login(username, password, loginSuccess, function(data) { updateMessage("Sorry, something went wrong. Please try again!"); });
}

function signupSuccess(data) {
    data = $.parseJSON(data);
    if (data.success == 1) {
        console.log("Registered successfully!");
        window.location.href = '/user/';
    } else {
        console.log("Error: " + data.reason);
        switch (data.reason) {
        case "already registered":
            updateMessage("This username has already been taken.");
            break;
        case "username required":
            updateMessage("You need a username to sign up.");
            break;
        case "password required":
            updateMessage("You need a password to sign up.");
            break;
        default:
            updateMessage("Error: " + data.reason);
        }
    }
}

function submitSignup() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    register(username, password, signupSuccess, function(data) { updateMessage( "Sorry, something went wrong. Try again!"); });
}
