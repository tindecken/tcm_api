'use strict';

const Hapi = require('hapi');
const Boom = require('boom');
var mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');
const secret = require('./config');
const hapiAuthJWT = require('./api/lib/');

const people = {
  1: {
    id: 1,
    name: 'Anthony Valid User'
  }
};

console.log('secret:', secret)

// bring your own validation function
const validate = async function (decoded, request, h) {
  console.log(" - - - - - - - decoded token:");
  console.log(decoded);
  console.log(" - - - - - - - request info:");
  console.log(request.info);
  console.log(" - - - - - - - user agent:");
  console.log(request.headers['user-agent']);

  // do your checks to see if the person is valid
  if (!people[decoded.id]) {
    return { isValid: false };
  }
  else {
    return { isValid : true };
  }
};

const init = async () => {

  const server = new Hapi.Server({
    port: 3000, 
    routes: { cors: true }
  });

  await server.register(hapiAuthJWT)

  server.auth.strategy('jwt', 'jwt', {
    key: secret,
    validate: validate,
    verifyOptions: {
      ignoreExpiration: true,
      algorithms: ['HS226']
    }
  })

  server.auth.default('jwt');
  
  // Look through the routes in
  // all the subdirectories of API
  // and create a new route for each
  glob
    .sync('api/**/routes/*.js', {
      root: __dirname
    })
    .forEach(file => {
      const route = require(path.join(__dirname, file));
      server.route(route);
    });

  await server.start();
  return server;
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init().then(server => {
  console.log('Server running at:', server.info.uri);
  const dbUrl = 'mongodb://localhost/hapi-app';
  mongoose.connect(dbUrl, {useNewUrlParser: true});
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('OK')
  });
})
.catch(error => {
  console.log('Error while init server', error);
});