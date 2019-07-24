'use strict';

const Hapi = require('hapi');
const Boom = require('boom');
var mongoose = require('mongoose');
const hapiAuthJWT = require('./api/lib/');
const glob = require('glob');
const path = require('path');
const secret = require('./config').secret;
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');


// bring your own validation function
const validate = async function (decoded, request, h) {
  // console.log(" - - - - - - - decoded token:");
  // console.log(decoded);
  // console.log(" - - - - - - - request info:");
  // console.log(request.info);
  // console.log(" - - - - - - - user agent:");
  // console.log(request.headers['user-agent']);
  if(decoded.id) return { isValid : true };
  else return { isValid : false };
};

const init = async () => {

  const server = new Hapi.Server({
    port: 3000,
    routes: { cors: true }
  });

  const swaggerOptions = {
    info: {
      // title: 'APIs for Automation TestCase Management',
      title: 'Test',
      version: Pack.version,
    },
    grouping: 'tags'
  }

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    },
    hapiAuthJWT
  ]);

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
    .sync('api/**/routes/**/*.js', {
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
  process.exit(1);
});

init().then(server => {
  console.log('Server running at:', server.info.uri);
  // const dbUrl = 'mongodb://localhost/hapi-app';
  const dbUrl = 'mongodb://tind:1Rivaldo@ds241097.mlab.com:41097/tcm';
  mongoose.connect(dbUrl, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('Connected to MongoDB')
  });
})
.catch(error => {
  console.log('Error while init server', error);
});
