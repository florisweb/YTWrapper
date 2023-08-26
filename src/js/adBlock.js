

class YTWrapper_AdBlock {
	#vidAdIndicators = ['#ad-text:f',
		'#ad-text:k',
		'#ad-preview:2',
		'#preskip-component:g',
		'#skip-button:x',
		'#skip-button:i',
		'#preskip-component:y',
		'#preskip-component:j',
		'.ytp-ad-player-overlay-skip-or-preview',
		'.ytp-ad-skip-button-slot'
	];

	constructor() {
		for (let i = 0; i < 10; i++) this.#vidAdIndicators.push('#skip-button:' + i);
		for (let i = 0; i < 10; i++) this.#vidAdIndicators.push('#preskip-component:' + i);
		for (let i = 0; i < 10; i++) this.#vidAdIndicators.push('#ad-text:' + i);
	}

	async setup() {
		multipleWatcher(() => this.isVideoAdPlaying(), () => {
			this.skipVideoAd();
			return wait(100);
		});
	}


	

	isVideoAdPlaying() {
		for (let pattern of this.#vidAdIndicators) 
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

	skipVideoAd() {
		let videos = document.getElementsByTagName('video');
		if (videos[0]) videos[0].currentTime = 100000;
		
		let skipButton = document.querySelectorAll('.ytp-ad-skip-button-slot')[0];
		if (skipButton) skipButton.click();
	}
}


// function YTWrapper_AdBlock() {
// 	let updates = 0;
//   	let lastImageAdUpdate = 0;

// 	this.update = function() {
// 	    updates++;

// 	    if (updates > lastImageAdUpdate + 10)
// 	    {
// 	      removeImageAds();
// 	      lastImageAdUpdate = updates;
// 	    }

// 	    if (!isVideoAdPlaying()) return;
// 	    skipVideoAd();
// 	}


// 	const vidAdIndicators = [
// 		'#ad-text:f',
// 		'#ad-text:k',
// 		'#ad-preview:2',
// 		'#preskip-component:g',
// 		'#skip-button:x',
// 		'#skip-button:i',
// 		'#preskip-component:y',
// 		'#preskip-component:j',
// 		'.ytp-ad-player-overlay-skip-or-preview',
// 		'.ytp-ad-skip-button-slot',
// 	];

// 	for (let i = 0; i < 10; i++) vidAdIndicators.push('#skip-button:' + i);
// 	for (let i = 0; i < 10; i++) vidAdIndicators.push('#preskip-component:' + i);
// 	for (let i = 0; i < 10; i++) vidAdIndicators.push('#ad-text:' + i);

// 	function isVideoAdPlaying() {
// 		for (let pattern of vidAdIndicators) 
// 		{
// 		  if (pattern.substr(0, 1) == '#')
// 		  {
// 		    if (document.getElementById(pattern.substr(1, 10000))) return true;
// 		    continue;
// 		  } 
// 		  if (document.querySelectorAll(pattern).length) return true;
// 		}
// 		return false;
// 	}

// 	async function skipVideoAd() {
// 		let videos = document.getElementsByTagName('video');
// 		if (videos[0]) videos[0].currentTime = 100000;
		
// 		let skipButton = document.querySelectorAll('.ytp-ad-skip-button-slot')[0];
// 		if (skipButton) skipButton.click();
// 	}


// 	let elementAds = [
// 		'ytd-banner-promo-renderer',
// 		'ytd-display-ad-renderer',
// 		'.ytd-display-ad-renderer',
// 		'.GoogleActiveViewElement',
// 		'#action-companion-click-target',
// 	];

// 	function getAllElementsToBeRemoved() {
// 		let elements = [];
// 		for (let pattern of elementAds) 
// 		{
// 		  if (pattern.substr(0, 1) == '#')
// 		  {
// 		    let element = document.getElementById(pattern.substr(1, pattern.length - 1));
// 		    if (!element) continue;
// 		    elements.push(element);
// 		    continue;
// 		  } 
// 		  let patternResults = document.querySelectorAll(pattern);
// 		  if (!patternResults.length) continue;
// 		  for (let node of patternResults) elements.push(node);
// 		}
// 		return elements;
// 	}

// 	function removeImageAds() {
// 		let ads = getAllElementsToBeRemoved();
// 		window.ads = ads;
// 		for (let i = ads.length - 1; i >= 0; i--)
// 		{
// 			ads[i].parentNode.removeChild(ads[i]);
// 		}
// 	}

// }