
window.addEventListener('DOMContentLoaded', () => {
  let logo = document.getElementById('logo-icon');
  logo.innerHTML = 'YTWrapper: Loaded';


  let loopStarted = false;
  let updates = 0;
  let lastImageAdUpdate = 0;
  let loop = function(_inLoop = false) {
    if (loopStarted && !_inLoop) return;
    if (!loopStarted) logo.innerHTML = 'YTWrapper: Running';
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

  document.body.onload = loop;







  const adIndicators = [
    'ad-text:4',
    'ad-text:f',
    'ad-preview:2',
    'preskip-component:g',
    'skip-button:x',
    'preskip-component:y'
  ];
  
  function isVideoAdPlaying() {
    for (let id of adIndicators) 
    {
      if (document.getElementById(id)) return true;
    }
    return false;
  }

  function skipVideoAd() {
    let videos = document.getElementsByTagName('video');
    if (!videos[0]) return;

    videos[0].currentTime = 100000;
  }


  function removeImageAds() {
    let ads = document.getElementsByClassName('ytd-display-ad-renderer');
    for (let i = ads.length - 1; i >= 0; i--) ads[i].parentNode.removeChild(ads[i]);
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
})
