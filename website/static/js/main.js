window.onload = window.onresize = function() {
    var intro = document.getElementById("introbox");
    if (window.innerHeight < intro.clientHeight) {
        intro.style.marginTop = "1em";
    } else {
        intro.style.marginTop = ((window.innerHeight - intro.clientHeight)/2) + "px";
    }
}
