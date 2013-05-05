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
    if (data.success) {
        console.log("Logged in successfully!");
        window.location.href = '/user/';
    } else {
        console.log("Error: " + data.reason);
        switch (data.reason) {
            case "bad password":
                updateMessage("You entered the wrong password. Please try again!");
                return;
            case "no account":
                updateMessage("You entered an invalid username. Did you mean to sign up?");
                return;
        }
    }
}

function submitLogin() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    login(username, password, loginSuccess, function(data) { updateMessage("Sorry, something went wrong. Please try again!"); });
}

function signupSuccess(data) {
    if (data.success) {
        console.log("Registered successfully!");
        window.location.href = '/user/';
    } else {
        console.log("Error: " + data.reason);
        switch (data.reason) {
            case "already registered":
                updateMessage("This username has already been taken.");
                return;
            case "password required":
                updateMessage("You need a password to log in.");
                return;
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
