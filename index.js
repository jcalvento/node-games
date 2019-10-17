#!/usr/bin/env node

const game = process.argv[2];
let language = process.argv[3];

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
const validLanguages = ['en', 'es'];
language = validLanguages.find(function(languagePrefix) { return languagePrefix === language });
const locale = require(`${__dirname}/locales/${language || 'en'}.json`);
const Polyglot = require('node-polyglot');
const i18n = new Polyglot({phrases: locale});

gameToPlay(i18n);

