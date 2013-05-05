var URL = "http://localhost:8000";

/* Helpers */
function _make_error_wrapper(error_cb) {
    function error_wrap(jqxhr, status, error) {
        if (login.arguments.length > 2) {
            error_cb( {
                'type': 'http',
                'error': error
            });
        } else {
            error_cb( {
                'type': status
            });
        }
    }
    return error_wrap;
}

function _make_success_wrapper(success_cb) {
    function success_wrap(data, status, jqxhr) {
        success_cb(data);
    }
    return success_wrap;
}
/* End helpers */

function dummy() {}

/* If there's an error doing the login POST, it calls error_cb with one of
   { 'type': <non-HTTP error> }
   { 'type': 'http', 'reason': <server return message> }

   Otherwise, it calls success_cb with one of the following:
   { 'success': true },
   { 'success': false, 'reason': 'bad password' },
   { 'success': false, 'reason': 'no account' }.
*/
function login(username, password, success_cb, error_cb) {
    $.ajax( {
        url: 'ajax/login',
        type: 'POST',
        data: {'username': username, 'password': password},
        success: _make_success_wrapper(success_cb),
        failure: _make_error_wrapper(error_cb)
    });
}

/* If there's an error doing the login POST, it calls error_cb with one of
   { 'type': <non-HTTP error> }
   { 'type': 'http', 'reason': <server return message> }

   Otherwise, it calls success_cb with one of the following:
   { 'success': true },
   { 'success': false, 'reason': 'already registered' },
   { 'success': false, 'reason': 'password required' },
   { 'success': false, 'reason': <other reason>}.
*/
function register(username, password, success_cb, error_cb) {
    $.ajax( {
        url: 'ajax/register',
        type: 'POST',
        data: {'username': username, 'password': password},
        success: _make_success_wrapper(success_cb),
        failure: _make_error_wrapper(error_cb),
    });
}

/* If there's an error doing the logout POST, it calls error_cb with one of
   { 'type': <non-HTTP error> }
   { 'type': 'http', 'reason': <server return message> }

   Otherwise, it calls success_cb with one of the following:
   { 'success': true },
   { 'success': false, 'reason': 'not logged in' }
*/
function logout(success_cb, error_cb) {
    $.ajax( {
        url: 'ajax/logout',
        type: 'GET',
        success: _make_success_wrapper(success_cb),
        failure: _make_error_wrapper(error_cb)
    });
}

function submitLogout() {
    logout(function(data) {
        console.log( URL );
        window.location.href = URL; },
           function(data) {
               if (data.type == 'http') {
                   console.log("HTTP Error: " + data.reason);
               } else {
                   console.log("Error: " + data.type );
               }
               window.location.href = URL; });
}

/* If there's an error, it calls error_cb with one of
   { 'type': <non-HTTP error> }
   { 'type': 'http', 'reason': <server return message> }

   Otherwise, it calls success_cb with one of the following:
   { 'success': true },
   { 'success': false, 'reason': 'not logged in' }
   { 'success': false, 'reason': 'this name has been taken' }
   */
function create_stash(stash_name, success_cb, error_cb) {
    $.ajax( {
        url: '../ajax/make_stash',
    type: 'GET',
    data: {'name': stash_name}, 
    success: _make_success_wrapper(success_cb),
    failure: _make_error_wrapper(error_cb)
    });
}

/* If there's an error, it calls error_cb with one of
   { 'type': <non-HTTP error> }
   { 'type': 'http', 'reason': <server return message> }

   Otherwise, it calls success_cb with one of the following:
   { 'success': true },
   { 'success': false, 'reason': 'not logged in' }
   */
function create_heap(stash_name, visible, success_cb, error_cb) {
    $.ajax( {
        url: '../ajax/make_heap',
    type: 'GET',
    data: {'name': stash_name, 'visible': visible}, 
    success: _make_success_wrapper(success_cb),
    failure: _make_error_wrapper(error_cb)
    });
}    

/* For "stashing" a link away... 

   If there's an error submitting a link, it calls error_cb with one of
   { 'type': <non-HTTP error> }
   { 'type': 'http', 'reason': <server return message> }

   Otherwise, it calls success_cb with one of the following:
   { 'success': true },
   { 'success': false, 'reason': 'not logged in' },
   { 'success': false, 'reason': 'no write access' }
   { 'success': false, 'reason': 'stash does not exist' }
*/
function stash_link(type, stash_id, title, link_url, success_cb, error_cb) {
    $.ajax( {
        url: 'ajax/stash_link',
        type: 'GET',
        data: {'type': type, 'stash': stash_id, 'title': title, 'url': link_url},
        success: _make_success_wrapper(success_cb),
        error: _make_error_wrapper(error_cb)
    });
}

/* For "throwing a link onto a heap"... 

   If there's an error submitting a link, it calls error_cb with one of
   { 'type': <non-HTTP error> }
   { 'type': 'http', 'reason': <server return message> }

   Otherwise, it calls success_cb with one of the following:
   { 'success': true },
   { 'success': false, 'reason': 'not logged in' },
   { 'success': false, 'reason': 'no write access' }
   { 'success': false, 'reason': 'heap does not exist' }
*/
function throw_link(heap_id, title, link_url, success_cb, error_cb) {
    $.ajax( {
        url: 'ajax/throw_link',
        type: 'GET',
        data: {'heap': heap_id, 'title': title, 'url': link_url},
        success: _make_success_wrapper(success_cb),
        error: _make_error_wrapper(error_cb)
    });
}

/* Toggle whether or not a stash takes gives from a certain heap.

   If there's an error setting changing the stash, it calls error_cb with one of
   { 'type': <non-HTTP error> }
   { 'type': 'http', 'reason': <server return message> }

   Otherwise, it calls success_cb with one of the following:
   { 'success': true , 'result': true/false},                <-- 'result' is the new value
   { 'success': false, 'reason': 'not logged in'},
   { 'success': false, 'reason': 'not your stash bro'},
   { 'success': false, 'reason': 'no read access to heap'}
   { 'success': false, 'reason': 'heap does not exist' }
   { 'success': false, 'reason': 'stash does not exist' }
*/
function stash_take_toggle(stash_id, heap_id, link_url, success_cb, error_cb) {
    $.ajax( {
        url: 'ajax/toggle_take',
        type: 'GET',
        data: {'stash': stash_id, 'heap': heap_id, 'url': link_url},
        success: _make_success_wrapper(success_cb),
        error: _make_error_wrapper(error_cb)
    });
}

function createStash() {
    var name = document.getElementById("stashName").value;
    console.log(document.getElementById("stashName"));
    console.log(name);
    create_stash(name, creationSuccess, function(data) { updateMessage("Sorry, something went wrong. Try again!"); });
}

function createHeap() {
    var name = document.getElementById("heapName").value;
    var visibility = document.getElementById("heapVisibility").checked;
    create_heap(name, visibility, creationSuccess, function(data) { updateMessage("Sorry, something went wrong. Try again!"); });
}

function createPost() {
    var data = window.location.pathname.split("/");
    var type = data[1];
    var title = document.getElementById("postName").value;
    var link = document.getElementById("postURL").value;
    stash_link(type, title, link, creationSuccess, function(data) { updateMessage("Sorry, something went wrong. Try again!"); });
}

function creationSuccess(data) {
    console.log(data);
    data = $.parseJSON(data);
    if (data.success == 1) {
        console.log("Created successfully!");
        window.location.href = '#';
    } else {
        console.log("Error: " + data.reason);
        switch (data.reason) {
            case "not logged in":
                updateMessage("You are not currently logged in.");
                break;
            case "this name has been taken":
                updateMessage("Please pick another name.");
                break;
            case "no write access":
                updateMessage("You cannot write here.");
                break;
            case "stash does not exist":
                updateMessage("You're writing somewhere that doesn't exist.");
                break;
            default:
                updateMessage("Error: " + data.reason);
        }
    }
}

// stash.js to allow for previewing in iframe
function preview(url) {
    window.frames['previewing'].document.location.href = url;
    // document.getElementById("previewing")
}
