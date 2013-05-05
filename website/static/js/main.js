window.onload = window.onresize = function() {
    var intro = document.getElementById("introbox");
    if (window.innerHeight < intro.clientHeight) {
        intro.style.marginTop = "1em";
    } else {
        intro.style.marginTop = ((window.innerHeight - intro.clientHeight)/2) + "px";
    }
}

function loginSuccess(data) {
    if (data.success) {
        console.log("Logged in successfully!");
    } else {
        console.log("Error: " + data.reason);
    }
}

function submitLogin() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    login(username, password, loginSuccess, function(data) { console.log("Sorry, something went wrong. Try again!"); });
}

function signupSuccess(data) {
    if (data.success) {
        alert("Congrats! You've created an account.");
    } else {
        alert(data.reason);
    }
}

function submitSignup() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    console.log("hi");
    register(username, password, signupSuccess, function(data) { console.log( "Sorry, something went wrong. Try again!"); });
}
