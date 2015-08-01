var ajax = ajax || {};

ajax.getJSON = function(url, callback){
	var request = new XMLHttpRequest();
	request.open('GET', url, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    // Success!
	    var data = JSON.parse(request.responseText);
	    callback(data);
	  } else {
	    // We reached our target server, but it returned an error
	    //console.log("Error retrieving " + url + " Response: " + request.responseText);
	  }
	};

	request.onerror = function() {
	  // There was a connection error of some sort
	  ajax.error = request.status + " - " + request.responseText;
	  console.log(ajax.error);
	};

	request.send();
}

ajax.error = "";

ajax.data = {};



