#!/usr/bin/env node

var game = process.argv[2];
var language = process.argv[3];

if (!game) {
  console.log('usage: node-games <game>');
  console.log('');
  console.log('Games');
  console.log('- spacecraft');
  console.log('- snake');
  console.log('- tanks');
  return;
}

require('babel-polyfill');

const gameToPlay = require(__dirname + '/build/' + game).default;
gameToPlay(language);

