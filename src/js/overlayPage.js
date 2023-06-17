

class OverlayPage {
	#HTML = {};
	get openState() {
		if (!this.#HTML) return false;
		return this.#HTML.classList.contains('hide');
	}
	constructor() {

	}
	setup() {
		this.#HTML = createElement('div', 'YTWrapper overlayPage hide');
		document.body.append(this.#HTML);
		return this.#HTML;
	}

	open() {
		this.#HTML.classList.remove('hide');
	}
	close() {
		this.#HTML.classList.add('hide');
	}
}


class LoadingPage extends OverlayPage {
	setup() {
		let html = super.setup();
		html.innerHTML = `<div class='loadingIcon'></div>`;
		html.classList.add('loadingPage');
		return html;
	}

}