

const MUSICMODE = Symbol();
const VIDEOMODE = Symbol();

const YTWrapper = new class {
	loadingPage;
	constructor() {
		this.loadingPage = new LoadingPage();
		this.adBlock 	= new YTWrapper_AdBlock();

	}

	setup() {
		this.loadingPage.setup();
		this.onPageChange();
		this.adBlock.setup();


		let lastLoc = '';
		multipleWatcher(() => lastLoc !== window.location.href,
			() => {
				lastLoc = window.location.href;
				YTWrapper.onPageChange();
				console.warn('change 1');
			}
		);
	}


	onPageChange() {
		this.loadingPage.open();
		setTimeout(() => this.loadingPage.close(), 500);
	}
} 

