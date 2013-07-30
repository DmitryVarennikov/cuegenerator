requirejs.config({
    baseUrl: '../',
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        nodeunit: 'tests/nodeunit.min',
    },
});

require([
    'tests/parser',
    'nodeunit',
], function(parserTests) {

    nodeunit.run({
        'Parser': parserTests,
    });

});
