function YTWrapper_NavBar() {
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

