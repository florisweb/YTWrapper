
console.warn('Main.js: loaded');

const YTWrapper = new function() {
	this.adBlock = new YTWrapper_AdBlock();
	this.navBar = new YTWrapper_NavBar();


	this.setup = function() {
		console.warn('YTWrapper.setup()');
		this.navBar.setup();
		this.update();
	}

	let updates = 0;
  	let lastSlowUpdate = 0;
	this.update = function() {
		updates++;
	    if (updates > lastSlowUpdate + 10)
	    {
	      lastSlowUpdate = updates;
	      insertVideoLinkInterseptors();
	    }

		this.adBlock.update();

		setTimeout(function() {
			YTWrapper.update()
		}, 100);
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

}

YTWrapper.setup();