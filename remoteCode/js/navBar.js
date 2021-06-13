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

    this.tabHolder.setup();
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
    /* {
        id,
        video: {
          url,
          title,
          channel
        }
    }*/

    this.setup = function() {
      if (localStorage.tabs) this.tabs = JSON.parse(localStorage.tabs);

      HTML.tabHolder.innerHTML = '';
      for (let tab of this.tabs) 
      {
        let tabElement = new Tab(tab);
        tab.element = tabElement;
      }
    }


    this.addTab = function(_tab) {
      let tab = new Tab(_tab);
      this.tabs.push(tab);
      this.writeTabsToLocalStorage();
    }

    this.removeTab = function(_id, _removeHTML = true) {
      for (let i = 0; i < this.tabs.length; i++)
      {
        if (this.tabs[i].id != _id) continue;
        if (_removeHTML) this.tabs[i].remove();
        this.tabs.splice(i, 1);
        break;
      }

      this.writeTabsToLocalStorage();
    }

    this.writeTabsToLocalStorage = function() {
      localStorage.tabs = JSON.stringify(this.tabs);
    }



    function Tab({id, video}) {
      let This = this;
      this.id = id;
      this.video = video;
      this.HTML = createHTML(video);

      function createHTML(_video) {
        let tab = document.createElement('div');
        tab.classList.add('tab');

        tab.innerHTML = '<div class="text closeButton">x</div><div class="text titleHolder"></div>';
        let closeButton = tab.children[0];
        setTextToElement(tab.children[1], _video.title);

        HTML.tabHolder.append(tab);

        tab.onclick = function(_e) {
          if (_e.target == closeButton) return This.remove();

          window.location.replace(This.video.url);
        }

        return tab;
      }

      this.remove = function() {
        this.HTML.classList.add('remove');
        setTimeout(function () {
          if (!This.HTML.parentNode) return;
          This.HTML.parentNode.removeChild(This.HTML);
        }, 300);
        
        YTWrapper.navBar.tabHolder.removeTab(this.id, false);
      }
    }
  }
}

