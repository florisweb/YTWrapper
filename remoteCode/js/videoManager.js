
function YTWrapper_VideoManager() {
	this.update = function() {
		insertSidebarVideoLinkInterseptors();
		insertHomescreenVideoLinkInterseptors();
	}

	function insertHomescreenVideoLinkInterseptors() {
		let elements = document.querySelectorAll('YTD-RICH-ITEM-RENDERER.style-scope.ytd-rich-grid-renderer #content #dismissible');
		for (let element of elements)
		{
			if (element.interseptorInserted) continue;
			element.interseptorInserted = true;

			let thumbnail = element.children[0].children[0];
			if (element.children[1].children.length < 2) continue;
			let info = element.children[1].children[1];
			let rawTitle = info.children[0].children[1].children[0].innerHTML;
			let rawChannelTitle = info.children[1].children[1].children[0].children[0].children[0].children[0].children[0].children[0].children[0].innerHTML;

			let link = thumbnail.href;
			thumbnail.style.pointerEvents = 'none';
			info.style.pointerEvents = 'none';


			let video = new Video({
				url: link,
				title: cleanString(rawTitle),
				channel: cleanString(rawChannelTitle)
			});
			if (Math.random() > .5) YTWrapper.navBar.tabHolder.addTab(video);

			element.onclick = async function() {
				if (await confirm(video.title)) window.location.replace(video.url);
			}
		}
	}


	function insertSidebarVideoLinkInterseptors() {
		let elements = document.getElementsByClassName('style-scope ytd-watch-next-secondary-results-renderer');
		for (let element of elements)
		{
			if (element.interseptorInserted || element.tagName != 'YTD-COMPACT-VIDEO-RENDERER') continue;

			element.interseptorInserted = true;

			let linkWrapper = element.children[0];
			let thumbnail = linkWrapper.children[0].children[0];
			let info = linkWrapper.children[1].children[0].children[0];

			let link = thumbnail.href;
			thumbnail.style.pointerEvents = 'none';
			info.style.pointerEvents = 'none';

			let rawTitle = info.children[0].children[1].innerHTML;
			let rawChannelTitle = info.children[1].children[0].children[0].children[0].children[0].children[0].children[0].children[0].innerHTML;


			let video = new Video({
				url: link,
				title: cleanString(rawTitle),
				channel: cleanString(rawChannelTitle)
			});
			YTWrapper.navBar.tabHolder.addTab(video);

			linkWrapper.onclick = async function() {
				if (await confirm(video.title)) window.location.replace(video.url);
			}
		}
	}

	function cleanString(_str) {
		return removeSpacesFromEnds(_str.split('\n').join(''));
	}



	function removeSpacesFromEnds(_str) {
	  for (let c = 0; c < _str.length; c++)
	  {
	    if (_str[0] !== " ") continue;
	    _str = _str.substr(1, _str.length);
	  }

	  for (let c = _str.length; c > 0; c--)
	  {
	    if (_str[_str.length - 1] !== " ") continue;
	    _str = _str.substr(0, _str.length - 1);
	  }
	  return _str;
	}

}


function Video({url, title, channel}) {
	this.url = url;
	this.title = title;
	this.channel = channel;

}