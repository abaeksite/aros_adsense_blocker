window.addEventListener('hashchange', function() {
    if (window.location.hash === '#google_vignette') {
        var cleanUrl = window.location.href.split('#')[0];
        window.location.replace(cleanUrl);
    }
});
