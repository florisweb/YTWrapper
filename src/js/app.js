

const MUSICMODE = Symbol();
const VIDEOMODE = Symbol();

const YTWrapper = new class {
	loadingPage;
	constructor() {
		this.loadingPage = new LoadingPage();

	}

	setup() {
		this.loadingPage.setup();

		checkChange();
		this.onPageChange();
	}


	onPageChange() {
		this.loadingPage.open();
		setTimeout(() => this.loadingPage.close(), 500);
	}
} 




let lastLoc = '';
function checkChange() {
	if (lastLoc != window.location.href)
	{
		lastLoc = window.location.href;
		YTWrapper.onPageChange();
		console.warn('change');
	}
	setTimeout(checkChange, 50);
}
