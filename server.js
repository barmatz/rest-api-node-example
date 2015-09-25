'use strict';

var express = require('express')
  , morgan = require('morgan')
  , bodyParser = require('body-parser')
  , chalk = require('chalk')
  , logger = require('./logger')
  , models = require('./models')
  , rest = require('./rest')
  , app = express()
  , port = process.env.PORT || 3000
  , environment = process.env.NODE_ENV || 'development'
  , server;

logger.info('Running in %s mode', chalk.cyan(environment));


app.use(morgan('dev'));

rest(app);

models.sequelize.sync()
  .then(function () {
    server = app.listen(port, function () {
      var address = server.address();

     logger.info('Listening on port %s', chalk.cyan(address.address + ':' + address.port));
    });
})
.catch(function (err) {
  logger.error(err);
});

module.exports = app;