function YTWrapper_NavBar() {
  let HTML = {};

  this.setup = function() {
    HTML = createHTML();
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



    let tabHolder = document.createElement('div');
    tabHolder.classList.add('tabHolder');
    bar.append(tabHolder);

    document.body.append(bar);
    return {
      navBar: bar,
      tabHolder: tabHolder
    };
  }





  this.tabHolder = new function() {
    this.tabs = [];


    this.addTab = function(_video) {
      let tab = new Tab(_video);
      this.tabs.push(tab);
    }





    function Tab(_video) {
      let This = this;
      this.video = _video;
      this.HTML = createHTML(_video);

      function createHTML(_video) {
        let tab = document.createElement('div');
        tab.classList.add('tab');

        tab.innerHTML = '<span class="text titleHolder"></span';
        setTextToElement(tab.children[0], _video.title);

        HTML.tabHolder.append(tab);

        tab.onclick = function() {
          window.location.replace(This.video.url);
        }

        return tab;
      }

    }
  }




}

