
window.addEventListener('DOMContentLoaded', () => {
  let logo = document.getElementById('logo-icon');
  logo.innerHTML = 'YTWrapper: Loaded';


  let loopStarted = false;
  let updates = 0;
  let lastImageAdUpdate = 0;

  function setup() {
    addCSS('https://florisweb.tk/YTWrapper/main.css?a=' + Math.round(Math.random() * 100000));
    logo.innerHTML = 'YTWrapper: Running';
    NavBar.setup();
  }


  let loop = function(_inLoop = false) {
    if (loopStarted && !_inLoop) return;
    loopStarted = true;
    setTimeout(function () {
      loop(true);
    }, 100);

    updates++;

    if (updates > lastImageAdUpdate + 10)
    {
      removeImageAds();
      lastImageAdUpdate = updates;
      insertVideoLinkInterseptors();
    }

    if (!isVideoAdPlaying()) return;
    skipVideoAd();
  }

  document.body.onload = function () {
    setup();
    loop();
  }











  const adIndicators = [
    '#ad-text:4',
    '#ad-text:f',
    '#ad-text:k',
    '#ad-preview:2',
    '#preskip-component:g',
    '#skip-button:x',
    '#skip-button:i',
    '#preskip-component:y',
    '#preskip-component:j',
    '.ytp-ad-player-overlay-skip-or-preview'
  ];
  
  function isVideoAdPlaying() {
    for (let pattern of adIndicators) 
    {
      if (pattern.substr(0, 1) == '#')
      {
        if (document.getElementById(pattern.substr(1, 10000))) return true;
        continue;
      } 
      if (document.querySelectorAll(pattern).length) return true;
    }
    return false;
  }

  function skipVideoAd() {
    let videos = document.getElementsByTagName('video');
    if (!videos[0]) return;

    videos[0].currentTime = 100000;
  }


  function removeImageAds() {
    let ads = [];
    let items = document.getElementsByClassName('ytd-display-ad-renderer');
    if (items.length) ads = ads.concat(items);
    let bannerAd = document.getElementById('action-companion-click-target');
    if (bannerAd) ads.push(bannerAd);
    for (let i = ads.length - 1; i >= 0; i--) ads[i].parentNode.removeChild(ads[i]);

    let xMarks = document.getElementsByClassName('ytp-ad-overlay-close-container');
    for (let xMark of xMarks) xMark.click();
  }



  function insertVideoLinkInterseptors() {
    let elements = document.getElementsByClassName('style-scope ytd-watch-next-secondary-results-renderer');
    for (let element of elements)
    {
      if (element.interseptorInserted || element.tagName != 'YTD-COMPACT-VIDEO-RENDERER') continue;

      console.log('add interseptor', element.tagName);
      element.interseptorInserted = true;
      
      let linkWrapper = element.children[0];
      let thumbnail = linkWrapper.children[0].children[0];
      let info = linkWrapper.children[1].children[0].children[0];
     
      let link = thumbnail.href;
      thumbnail.style.pointerEvents = 'none';
      info.style.pointerEvents = 'none';

      linkWrapper.onclick = function() {
        alert('open link: ' + link);
        window.location.replace(link);
      }
    }
  }
});




const NavBar = new function() {
  let HTML = {};

  this.setup = function() {
    HTML.navBar = createHTML();
    HTML.ytdApp = document.getElementsByTagName('ytd-app')[0];
    HTML.ytdApp.addEventListener('scroll', function() {
      HTML.navBar.classList.remove('showInFullScreen');
      if (HTML.ytdApp.scrollTop <= 0) return;
      HTML.navBar.classList.add('showInFullScreen');
    });
  }




  function createHTML() {
    let bar = document.createElement('div');
    bar.setAttribute('id', 'navBar');
    document.body.append(bar);
    return bar;
  }
}




function addCSS(filename){
  var head = document.getElementsByTagName('head')[0];

  var style = document.createElement('link');
  style.href = filename;
  style.type = 'text/css';
  style.rel = 'stylesheet';
  head.append(style);
}



