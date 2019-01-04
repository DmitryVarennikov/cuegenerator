define([
    'jquery'
], function () {

    // stretching text areas
    var height = $(document).height() - 20;
    $('#tracklist').animate({height: height - 375});
    $('#cue').animate({height: height - 173});

    $('#cue').one('click', function () {
        $(this).select();
    });

    // showing a link to the chrome extension download page if needed
    var isChromeBrowser = navigator.userAgent.toLowerCase().indexOf('chrome') > - 1;
    if (isChromeBrowser) {
        var manifest = document.createElement('script');
        manifest.src = 'chrome-extension://phoaoafhahilmaoddhppejobcmgnglmc/manifest.json';
        document.body.appendChild(manifest);
        // show if extension manifest can not be loaded
        manifest.onerror = function () {
            var chromeExtension = document.getElementById('chrome-extension');
            chromeExtension.style.display = 'block';

            // calculate button left corner
            var left = Math.round((document.body.offsetWidth - chromeExtension.offsetWidth) / 2);
            chromeExtension.style.left = left + 'px';
        };
    }

});
