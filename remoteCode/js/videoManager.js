
function YTWrapper_VideoManager() {
	const This = this;
	this.blockedChannels = [];
	this.setup = function() {
		if (localStorage.blockedChannels) this.blockedChannels = JSON.parse(localStorage.blockedChannels);
		if (!this.blockedChannels) this.blockedChannels = [];

		this.blockButton.setup();
	}

	this.update = function() {
		this.scrapeCurVideo();
		insertSidebarVideoLinkInterseptors();
		insertHomescreenVideoLinkInterseptors();

		if (!this.curVideo) return;
		this.blockButton.setBlockStatus(this.blockedChannels.includes(this.curVideo.channel));
	}

	document.body.addEventListener('load', function() {
		YTWrapper.videoManager.scrapeCurVideo();
		console.log('test', YTWrapper.videoManager.curVideo);
	})


	this.curVideo = false;
	this.scrapeCurVideo = function() {
		let titleHolder = document.querySelector('#info-contents .title .style-scope');
		let channelHolder = document.querySelector('#upload-info.ytd-video-owner-renderer .ytd-channel-name a');
		if (!titleHolder || !channelHolder) return this.curVideo = false;

		this.curVideo = new Video({
			url: window.location.href,
			title: cleanString(titleHolder.innerHTML),
			channel: cleanString(channelHolder.innerHTML),
		});
		return this.curVideo;
	}




	this.blockButton = new function() {
		const Button = this;
		const HTML = {}

		this.blocked = false;
		this.setup = function() {
			let buttonHolder = document.querySelector('#info-contents #menu ytd-menu-renderer');
			if (!buttonHolder) return setTimeout(() => {YTWrapper.videoManager.blockButton.setup()}, 100);

			HTML.button = document.createElement('div');
			HTML.button.className = 'text button blockButton';
			HTML.button.onclick = function() {
				if (!YTWrapper.videoManager.curVideo) return;
				Button.setBlockStatus(!Button.blocked);
				if (Button.blocked)
				{
					This.blockedChannels.push(This.curVideo.channel);
				} else {
					This.blockedChannels.splice(This.blockedChannels.indexOf(This.curVideo.channel), 1);
				}
				localStorage.blockedChannels = JSON.stringify(This.blockedChannels);
			}

			buttonHolder.append(HTML.button);
			this.setBlockStatus(false);
		}

		this.setBlockStatus = function(_status) {
			this.blocked = _status;
			if (this.blocked)
			{
				HTML.button.innerHTML = 'UNBLOCK CHANNEL';
			} else {
				HTML.button.innerHTML = 'BLOCK CHANNEL';
			}
		}
	}



	function insertHomescreenVideoLinkInterseptors() {
		let elements = document.querySelectorAll('YTD-RICH-ITEM-RENDERER.ytd-rich-grid-renderer');
		for (let element of elements)
		{
			// if (element.interseptorInserted) continue;
			// element.interseptorInserted = true;
			new VideoElement(element);
		}
	}

	function VideoElement(_element) {
		let element = _element;
		this.video;
		this.remove = function() {
			element.parentNode.removeChild(element);
		}


		let titleElement = element.querySelector('#video-title');
		let channelElement = element.querySelector('.ytd-channel-name .yt-formatted-string');
		let thumbnail = element.querySelector('#thumbnail');
		let details = element.querySelector('#details');


		if (!titleElement || !channelElement || !thumbnail || !details) return this.remove();

		thumbnail.style.pointerEvents = 'none';
		details.style.pointerEvents = 'none';


		let video = new Video({
			url: thumbnail.href,
			title: cleanString(titleElement.innerHTML),
			channel: cleanString(channelElement.innerHTML)
		});

		if (video.shouldRemove()) return this.remove();


		element.onclick = () => {
			YTWrapper.navBar.tabHolder.addTab({video: video});
		};
	}

	function cleanString(_str) {
		return removeSpacesFromEnds(_str.split('\n').join(''));
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

			linkWrapper.onclick = async function() {
				YTWrapper.navBar.tabHolder.addTab({video: video});
			}
		}
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
	this.key = this.url.split('.com/watch?v=')[1];
	this.title = title;
	this.channel = channel;

	this.shouldRemove = function() {
		return YTWrapper.videoManager.blockedChannels.includes(this.channel);
	}
}




