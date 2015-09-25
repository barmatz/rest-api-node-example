'use strict';

var winston = require('winston'),
    level = 'info';

switch (process.env.NODE_ENV) {
  default:
  case 'development':
    level = 'debug';
    break; 
  case 'test':
    level = 'test';
    break; 
  case 'production':
    level = 'info';
    break; 
}

module.exports = new winston.Logger({
  transports: [
    new winston.transports.Console({ colorize: true, level: level })
  ]
});