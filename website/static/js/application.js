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
function logout(username, success_cb, error_cb) {
    $.ajax( {
	url: 'ajax/logout',
	type: 'GET',
	data: {'username': username}, 
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
   { 'success': false, 'reason': '<stash_name> already exists' }
*/
function create_stash(stash_name, success_cb, error_cb) {
    $.ajax( {
	url: 'ajax/make_stash',
	type: 'GET',
	data: {'owner': owner, 'name': stash_name}, 
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
   { 'success': false, 'reason': '<hash_name> already exists' }
*/
function create_stash(stash_name, visible, success_cb, error_cb) {
    $.ajax( {
	url: 'ajax/make_stash',
	type: 'GET',
	data: {'owner': owner, 'name': stash_name}, 
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
function stash_link(stash_id, title, link_url, success_cb, error_cb) {
    $.ajax( {
	url: 'ajax/stash_link',
	type: 'GET',
	data: {'stash': stash_id, 'title': title, 'url': link_url},
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

// stash.js to allow for previewing in iframe
function preview(url) {
    window.frames['previewing'].document.location.href = url;
    // document.getElementById("previewing")
}
