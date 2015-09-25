'use strict';

var epilogue = require('epilogue')
  , JsonApiSerializer = require('jsonapi-serializer')
  , inflected = require('inflected');


module.exports = function (model, attributes, associations) {
  var name = model.name
    , pluralName = inflected.pluralize(name)
    , milestones = {
        data: function (req, res, context) {
          var instance = context.instance;

          if (instance instanceof Array) {
            instance = instance.map(function (instance) {
              return instance.get();
            });
          } else {
            instance = instance.get();
          }

          context.instance = new JsonApiSerializer(pluralName, instance, {
            topLevelLinks: {
              self: req.url
            },
            dataLinks: {
              self: function (user) {
                return req.url + '/' + user.id;
              }
            },
            attributes: attributes
          });

          context.continue();
        }
      };

  epilogue
    .resource({
      model: model,
      endpoints: [ '/' + pluralName, '/' + pluralName + '/:id' ],
      attributes: attributes,
      associations: !!associations
    })
      .use({
        read: milestones,
        list: milestones
      });
};