
/* Helpers */
function _make_error_wrapper(error_cb) {
    function error_wrap(jqxhr, status, error) {
	if (login.arguments.length > 2) {
	    error_cb( {
		'type': 'http':
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


/* If there's an error doing the login POST, it calls error_cb with one of
   { 'type': <non-HTTP error> }
   { 'type': 'http', 'reason': <server return code> }

   Otherwise, it calls success_cb with one of the following:
   { 'success': true },
   { 'success': false, 'reason': 'bad password' },
   { 'success': false, 'reason': 'no account' }.
*/
function login(username, password, success_cb, error_cb) {
    $.ajax( {
	url: 'ajax/login',
	type: 'POST',
	data: {'name': username, 'password': password},
	success: _make_success_wrapper(success_cb),
	failure: _make_error_wrapper(error_cb)
    });
}

/* If there's an error doing the logout POST, it calls error_cb with one of
   { 'type': <non-HTTP error> }
   { 'type': 'http', 'reason': <server return code> }

   Otherwise, it calls success_cb with one of the following:
   { 'success': true },
   { 'success': false, 'reason': 'not logged in' }
*/
function logout(username, success_cb, error_cb) {
    $.ajax( {
	url: 'ajax/logout',
	type: 'GET',
	data: {'name': username}, 
	success: _make_success_wrapper(success_cb),
	failure: _make_error_wrapper(error_cb)
    });
}

/* If there's an error submitting a link, it calls error_cb with one of
   { 'type': <non-HTTP error> }
   { 'type': 'http', 'reason': <server return code> }

   Otherwise, it calls success_cb with one of the following:
   { 'success': true },
   { 'success': false, 'reason': 'not logged in' },
   { 'success': false, 'reason': 'no write access' }
*/
//function submit_link(title, link_url, success_cb, error_cb) {
    
