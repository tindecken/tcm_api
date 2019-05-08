'use strict';

const Hapi = require('hapi');
const Boom = require('boom');
var mongoose = require('mongoose');
const JWT = require('jsonwebtoken');
const hapiAuthJWT = require('./api/lib/');
const glob = require('glob');
const path = require('path');
const secret = require('./config');



// bring your own validation function
const validate = async function (decoded, request, h) {
  console.log(" - - - - - - - decoded token:");
  console.log(decoded);
  console.log(" - - - - - - - request info:");
  console.log(request.info);
  console.log(" - - - - - - - user agent:");
  console.log(request.headers['user-agent']);
  if(decoded.id) return { isValid : true };
  else return { isValid : false };
};

const init = async () => {

  const server = new Hapi.Server({
    port: 3000, 
    routes: { cors: true }
  });

  await server.register(hapiAuthJWT)

  server.auth.strategy('jwt', 'jwt',
  { key: secret,          // Never Share your secret key
    validate: validate,            // validate function defined above
    verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
  });

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
  mongoose.connect(dbUrl, { useNewUrlParser: true, useCreateIndex: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('Connected to MongoDB')
  });
})
.catch(error => {
  console.log('Error while init server', error);
});