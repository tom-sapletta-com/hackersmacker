(function() {
  var app, express, fs, graph;

  express = require('express');

  fs = require('fs');

  app = express.createServer();

  graph = require('./graph');

  app.use(express.bodyParser());

  app.get('/load', function(req, res) {
    var originalUsername, usernames;
    res.header('Access-Control-Allow-Origin', 'http://news.ycombinator.com');
    originalUsername = req.query.me;
    usernames = req.query.u;
    return graph.findRelationships(originalUsername, usernames, function(m) {
      console.log((" ---> [" + originalUsername + "] Load " + req.headers.referer + ":") + (" " + usernames.length + " users -") + (" " + m.friends.length + " friends, " + m.foes.length + " foes,") + (" " + m.foaf_friends.length + "/" + m.foaf_foes.length + " foaf"));
      res.contentType('json');
      return res.send("" + (JSON.stringify(m)));
    });
  });

  app.get('/save', function(req, res) {
    var originalUsername, relationship, response, username;
    res.header('Access-Control-Allow-Origin', 'http://news.ycombinator.com');
    username = req.query.username;
    relationship = req.query.relationship;
    originalUsername = req.query.me;
    graph.saveRelationship(originalUsername, relationship, username);
    response = {
      code: 1,
      message: "OK"
    };
    return res.send("" + (JSON.stringify(response)));
  });

  app.get('/safari', function(req, res) {
    return res.redirect('/safari.safariextz');
  });

  app.get('/safari.safariextz', function(req, res) {
    return fs.readFile('../client/Safari.safariextz', function(err, data) {
      if (err) throw err;
      res.contentType('application/octet-stream');
      return res.send(data);
    });
  });

  app.get('/safari.manifest.plist', function(req, res) {
    return fs.readFile('config/safari.manifest.plist', function(err, data) {
      if (err) throw err;
      res.contentType('application/octet-stream');
      return res.send(data);
    });
  });

  app.use(express.static("" + __dirname + "/../web"));

  app.listen(3030);

}).call(this);
