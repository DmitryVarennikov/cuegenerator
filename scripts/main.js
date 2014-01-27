requirejs.config({
    baseUrl: 'scripts',
    urlArgs: "bust=" + (new Date()).getTime(),
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
