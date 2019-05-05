'use strict';

const Hapi = require('hapi');
const Boom = require('boom');
var mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');
const secret = require('./config');


const init = async () => {

  const server = new Hapi.Server({
    port: 3000, 
    routes: { cors: true }
  });

  const people = { // our "users database"
    1: {
      id: 1,
      name: 'Jen Jones'
    }
  };

  // bring your own validation function
  const validate = async function (decoded, request) {

      // do your checks to see if the person is valid
      if (!people[decoded.id]) {
        return { isValid: false };
      }
      else {
        return { isValid: true };
      }
  };

  await server.register(require('hapi-auth-jwt2'))

  server.auth.strategy('jwt', 'jwt', {
    key: 'secret',
    validate: validate,
    verifyOptions: {
      algorithms: ['HS226']
    }
  })

  server.auth.default('jwt')
  
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