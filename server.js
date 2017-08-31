//var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
//var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var apiKey = process.env.apiKey;
var auth = process.env.auth;
//
//self.app = express();
//self.ipaddress = '0.0.0.0';
//self.port = 8080;

var express = require('express');
var server = express();
var request = require('request-json');
server.set('port', (process.env.PORT || 5000));


//var client = request.newClient('https://jbossunifiedpush-camon.rhcloud.com/ag-push/');
//var client1 = request.newClient('https://jbossunifiedpush1-camon.rhcloud.com/ag-push/');

// server.param('PushApplicationID', /^\d+$/);
// server.param('MasterSecret', /^\d+$/);
// server.param('alias', /^\d+$/);
// server.param('alert', /^\d+$/);

server.get('/:alias/:alert/:sound*?', function(req, res){
	console.log(req.params);
	var reg = /^[0-9]$/;
	var alias = [req.params.alias];
  	var data = {
    		"alias": [req.params.alias],
    		"message": {
     			"alert":"Alarme "+ [req.params.alert.replace(/_/g,' ')],
			"sound":reg.test(req.params.sound) ? "" + req.params.sound + ".caf" : "mySound.caf"
		}
    	};

	// préparation du message
	
	var message = { 
  		app_id: apiKey,
  		contents: {"en": "Alarme "+ [req.params.alert.replace(/_/g,' ‘)]},
  		//filters: [
	  	//	{"field": "tag", "key": "user", "relation": "=", "value": alias}
		//]
		included_segments: ["All"]
	};

	// préparation de la commande

	var sendNotification = function(data) {
  		var headers = {
    			"Content-Type": "application/json; charset=utf-8",
    			"Authorization":"Basic " + auth
  		};
  
  		var options = {
    			host: "onesignal.com",
    			port: 443,
    			path: "/api/v1/notifications",
    			method: "POST",
    			headers: headers
  		};
  
  		var https = require('https');
  		var req = https.request(options, function(res) {  
    			res.on('data', function(data) {
      				console.log("Response:");
      				console.log(JSON.parse(data));
    			});
		});
  
  		req.on('error', function(e) {
    			console.log("ERROR:");
    			console.log(e);
  		});
  
  		req.write(JSON.stringify(data));
  		req.end();
	};

	sendNotification(message);
});

server.listen(server.get('port'), function () {
  console.log( "Listening on " + server.get('port') + " with apiKey " + apiKey)
});
