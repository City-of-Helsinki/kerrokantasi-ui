const jsdom = require('jsdom').jsdom;
const chai = require('chai');

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;
global.expect = chai.expect;
global.assert = chai.assert;
