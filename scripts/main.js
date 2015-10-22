requirejs.config({
    baseUrl: 'scripts',
    urlArgs: require.specified('main') ? "bust=" + (new Date()).getTime() : null,
    paths:   {
        jquery: [
            '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min',
            'lib/jquery-1.9.1.min'
        ]
    }
});

require([
    'layout',
    'cue'
], function () {

});
