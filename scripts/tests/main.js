requirejs.config({
    baseUrl: '../',
    urlArgs: "bust=" + (new Date()).getTime(),
    paths:   {
        nodeunit: 'tests/nodeunit.min'
    }
});

require([
    'tests/parser',
    'tests/formatter',
    'nodeunit'
], function (parserTestSuite, formatterTestSuite) {

    nodeunit.run({
        'Parser':    parserTestSuite,
        'Formatter': formatterTestSuite
    });

});
