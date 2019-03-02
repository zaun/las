(function() {
  const wait = (method, cb) => {
    if (window[method]) {
        cb();
    } else {
        setTimeout(function () { wait(method, cb); }, 100); // check every 100ms
    }
  }

  const mapScript = document.createElement('SCRIPT');

  mapScript.setAttribute('src', 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js');
  mapScript.setAttribute('async', '');
  mapScript.setAttribute('defer', '');

  document.head.appendChild(mapScript);

  wait('mapkit', () => {
    mapkit.init({
      authorizationCallback: function(done) {
        const url = `${process.env.VUE_APP_ROOT_API}/token/mapkit`;
        console.log(url);
        fetch(url)
          .then(res => res.text())
          .then((token) => {
            console.log(token);
            done(token);
          });
      },
      language: "en"
    });
  });
})();
