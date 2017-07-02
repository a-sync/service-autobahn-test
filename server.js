'use strict';

global.AUTOBAHN_DEBUG = false;
const autobahn = require('autobahn');

const connection = new autobahn.Connection({
    url: 'ws://localhost:8080/ws',
    realm: 'realm1'
});

var abSession = null;
connection.onopen = function(session, details) {
    console.log('CONNECTION opened');

    abSession = session;

    connected();
};

connection.onclose = function(reason, details) {
    console.log('CONNECTION closed:', reason, details);
};

connection.open();

function connected() {
    //TODO:
}