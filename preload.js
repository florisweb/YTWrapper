window.addEventListener('DOMContentLoaded', () => {
  let logo = document.getElementById('logo-icon');
  logo.innerHTML = 'YTWrapper: Loaded';

  function setup() {
    addCSS('https://florisweb.tk/YTWrapper/main.css?a=' + Math.round(Math.random() * 100000));
    addJS('https://florisweb.tk/YTWrapper/main.js?a=' + Math.round(Math.random() * 100000));
    logo.innerHTML = 'YTWrapper: Running';
  }


  document.body.onload = function () {
    setup();
  }
});



function addCSS(filename){
  var head = document.getElementsByTagName('head')[0];

  var style = document.createElement('link');
  style.href = filename;
  style.type = 'text/css';
  style.rel = 'stylesheet';
  head.append(style);
}

function addJS(filename){
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.setAttribute('src', filename);
  head.append(script);
}
