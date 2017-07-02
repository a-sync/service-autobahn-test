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
    abSession.subscribe('service.do.publish', doPublish).then(
        function (sub) {
            console.log("subscribed to topic service.do.publish");
        },
        function (err) {
            console.log("failed to subscribe: ", err);
        }
    );

    abSession.subscribe('service.do.call', doCall).then(
        function (sub) {
            console.log("subscribed to topic service.do.call");
        },
        function (err) {
            console.log("failed to subscribe: ", err);
        }
    );

    // SUBSCRIBE to a topic and receive events
    //
    abSession.subscribe('test.main.publish', mainPublish).then(
        function (sub) {
            console.log("subscribed to topic test.main.publish");
        },
        function (err) {
            console.log("failed to subscribe: ", err);
        }
    );

    abSession.subscribe('test.renderer.publish', rendererPublish).then(
        function (sub) {
            console.log("subscribed to topic test.renderer.publish");
        },
        function (err) {
            console.log("failed to subscribe: ", err);
        }
    );

    // REGISTER a procedure for remote calling
    //
    abSession.register('test.main.call', mainCall).then(
        function (reg) {
            console.log("procedure test.main.call registered");
        },
        function (err) {
            console.log("failed to register procedure: ", err);
        }
    );

    abSession.register('test.renderer.call', rendererCall).then(
        function (reg) {
            console.log("procedure test.renderer.call registered");
        },
        function (err) {
            console.log("failed to register procedure: ", err);
        }
    );
}

function mainPublish (args, kwargs, details) {
    console.log('mainPublish', args, kwargs, details);
}

function rendererPublish (args, kwargs, details) {
    console.log('rendererPublish', args, kwargs, details);
}

function mainCall (args, kwargs, details) {
    console.log('mainCall', args, kwargs, details);

    let re = {
        id: "return service.deepObj",
        deepObj: getDeepObj('mainCall')
    };

    return re;
}

function rendererCall (args, kwargs, details) {
    console.log('rendererCall', args, kwargs, details);

    let re = {
        id: "return service.deepObj",
        deepObj: getDeepObj('rendererCall')
    };

    return re;
}

var v = 200;
function doPublish (args, kwargs, details) {
    console.log('doPublish');
    // PUBLISH an event
    //
    abSession.publish('test.main.subscribe', null, getDeepObj(++v)).then(
        function (res) {
            console.log("published to test.main.subscribe");
        },
        function (err) {
            console.log("failed to publish to test.main.subscribe", err);
        }
    );

    abSession.publish('test.renderer.subscribe', null, getDeepObj(++v)).then(
        function (res) {
            console.log("published to test.renderer.subscribe");
        },
        function (err) {
            console.log("failed to publish to test.renderer.subscribe", err);
        }
    );
}

function doCall (args, kwargs, details) {
    console.log('doCall');
    // CALL a remote procedure
    //
    abSession.call('test.main.register', null, getDeepObj(++v)).then(
        function (res) {
            console.log("test.main.register called with result: ", res);
        },
        function (err) {
            console.log("call of test.main.register failed: ", err);
        }
    );

    abSession.call('test.renderer.register', null, getDeepObj(++v)).then(
        function (res) {
            console.log("test.renderer.register called with result: ", res);
        },
        function (err) {
            console.log("call of test.renderer.register failed: ", err);
        }
    );
}

function getDeepObj(deepValue) {
    function getChilds(v) {
        return {
            child1: {
                id: "child1" + v,
                childs: {
                    child2: {
                        id: "child2" + v,
                        childs: {
                            child3: v
                        }
                    }
                }
            }
        };
    }
    return [
        deepValue,
        getChilds(0),
        {
            more: [
                getChilds(1),
                [
                    getChilds(2),
                    [
                        {
                            deepKey:"deepValue",
                            deepArr:
                                [
                                    4,
                                    3,
                                    "deepArrValue",
                                    {
                                        deepChilds: getChilds(deepValue),
                                        val: ["val", "ue"]
                                    }
                                ]
                        },
                        getChilds(3)
                    ],
                    2,
                    1
                ]
            ],
            less: 0
        }
    ];
}