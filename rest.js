'use strict';

var epilogue = require('epilogue')
  , models = require('./models')
  , resource = require('./utils/rest-resource');


module.exports = function (app) {
  epilogue.initialize({
    app: app,
    sequelize: models.sequelize,
    base: '/api'
  });

  resource(models.user, [ 'id', 'name', 'createdAt' ]);
  resource(models.comment, [ 'id', 'verbatim', 'createdAt', 'user' ], true);
};