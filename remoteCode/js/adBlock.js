


function YTWrapper_AdBlock() {
	let updates = 0;
  	let lastImageAdUpdate = 0;

	this.update = function() {
	    updates++;

	    if (updates > lastImageAdUpdate + 10)
	    {
	      removeImageAds();
	      lastImageAdUpdate = updates;
	    }

	    if (!isVideoAdPlaying()) return;
	    skipVideoAd();
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
		let items1 = document.getElementsByClassName('ytd-display-ad-renderer');
		if (items1.length) ads = [...ads, ...items1];

		let items2 = document.getElementsByClassName('GoogleActiveViewElement')
		if (items2.length) ads = [...ads, ...items2];

		let bannerAd = document.getElementById('action-companion-click-target');
		if (bannerAd) ads.push(bannerAd);
		for (let i = ads.length - 1; i >= 0; i--) ads[i].parentNode.removeChild(ads[i]);


		let xMarks = document.getElementsByClassName('ytp-ad-overlay-close-container');
		for (let xMark of xMarks) xMark.click();
	}

}