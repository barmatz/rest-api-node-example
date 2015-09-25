'use strict';

var epilogue = require('epilogue')
  , JsonApiSerializer = require('jsonapi-serializer')
  , inflected = require('inflected');


module.exports = function (model, attributes, includeAssociations) {
  var name = model.name
    , pluralName = inflected.pluralize(name)
    , milestones = {
        data: function (req, res, context) {
          var instance = context.instance
            , requestUrl = req.url;

          if (instance instanceof Array) {
            instance = instance.map(function (instance) {
              return instance.get();
            });
          } else {
            instance = instance.get();
          }

          context.instance = new JsonApiSerializer(pluralName, instance, {
            topLevelLinks: {
              self: requestUrl
            },
            dataLinks: {
              self: function (instance) {
                var id = instance.id;

                if (new RegExp('/' + id + '$').test(requestUrl)) {
                  return requestUrl;
                } else {
                  return requestUrl + '/' + instance.id;
                }

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
      associations: !!includeAssociations
    })
      .use({
        read: milestones,
        list: milestones
      });
};