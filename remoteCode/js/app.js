

const YTWrapper = new function() {
	this.adBlock = new YTWrapper_AdBlock();
	this.navBar = new YTWrapper_NavBar();
	this.videoManager = new YTWrapper_VideoManager();


	this.setup = function() {
		let logo = document.getElementById('logo-icon');
		logo.innerHTML = 'YTWrapper: Running';

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
	      this.videoManager.update();
	    }

		this.adBlock.update();

		setTimeout(function() {
			YTWrapper.update()
		}, 100);
	}

}

YTWrapper.setup();