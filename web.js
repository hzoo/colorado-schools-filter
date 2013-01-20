var express = require('express');
var util    = require('util');

// create an express webserver
var app = express.createServer(
  express.logger(),
  express.static(__dirname + '/public'),
  express.bodyParser(),
  express.cookieParser(),
  // set this to a secret value to encrypt session cookies
  express.session({ secret: process.env.SESSION_SECRET || 'asdf32sd12w' })
);

// listen to the PORT given to us in the environment
var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

function render_page(req, res) {
  res.sendfile(__dirname + '/index.html');
}

function handle_request(req, res) {
    render_page(req, res);
}

app.get('/', handle_request);
app.post('/', handle_request);
