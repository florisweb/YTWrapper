
function YTWrapper_AccessManager() {
	let This = this;
	let HTML = createHTML();
	this.disabled = false;


	function createHTML() {
		let holder = document.createElement('div');
		holder.className = 'accessDisableHolder hide';
		holder.innerHTML = 	"<div class='page'>" + 
								"<div class='textHolder'>" + 
									"<div class='text header'>DISABLED</div>" + 
									"<div class='text reasonHolder'>Time's up</div>" + 
									"<div class='text button'>Settings</div>" + 
								"</div>" +
							"</div>" +
							"<div class='page hide'>" + 
								"<div class='textHolder'>" + 
									"<div class='text header'>SETTINGS</div>" + 
									"<br>" + 
									"<div class='text'>Allowed timedomains</div>" + 
									"<div class='domainHolder'></div>" + 
									"<br><br>" + 
									"<div class='text button'>Close</div>" + 
								"</div>" +
							"</div>";

		document.body.append(holder);
		holder.children[0].children[0].children[2].onclick = function () {This.settingsPage.open()};
		holder.children[1].children[0].children[6].onclick = function () {This.disabledPage.open()};

		return {
			holder: holder,
		}
	}


	this.disabledPage 	= new AccessManger_disabledPage(this);
	this.settingsPage 	= new AccessManger_settingsPage(this);
	this.curPage 		= this.disabledPage;


	this.allowedTimeDomains = [[1000, 1100], [1200, 1300], [1400, 1439]];// [startMinute, stopMinute]
	this.timeHistory = {}; // '12-6-2021': [[0, 50], [100, 120]],
	this.maxTotalTime = 1440; // minutes

	this.open = function() {
		HTML.holder.classList.remove('hide');
	}

	this.close = function() {
		HTML.holder.classList.add('hide');
	}




	this.setup = function() {
		if (localStorage.timeHistory) this.timeHistory = JSON.parse(localStorage.timeHistory);
		if (localStorage.maxTotalTime) this.maxTotalTime = parseInt(localStorage.maxTotalTime);
		if (localStorage.allowedTimeDomains) this.allowedTimeDomains = JSON.parse(localStorage.allowedTimeDomains);
		this.disabledPage.updateStatus();
		YTWrapper.navBar.setTimeWatched(this.getTotalTimeToday());
	}

	
	this.update = function() {
		this.disabledPage.updateStatus();
		if (this.disabledPage.disabled) return;

		let curTime = new Date().getTimeInMinutes();
		let curDate = new Date().toString();
		let curEntry = this.timeHistory[curDate];
		if (!curEntry) curEntry = []; 
		
		let addedEntry = false;
		for (let i = 0; i < curEntry.length; i++)
		{
			if (curTime - curEntry[i][1] > 2) continue;
			curEntry[i][1] = curTime;
			addedEntry = true;
			break
		}

		if (!addedEntry) curEntry.push([curTime, curTime]);
		this.timeHistory[curDate] = curEntry;
		localStorage.timeHistory = JSON.stringify(this.timeHistory);
		YTWrapper.navBar.setTimeWatched(this.getTotalTimeToday());
	}

	this.getTotalTimeToday = function() {
		let curDate = new Date().toString();
		let curEntry = YTWrapper.accessManager.timeHistory[curDate];
		if (!curEntry) return 0;
		let total = 0;
		for (let domain of curEntry) total += domain[1] - domain[0];
		return total;;
	}
}










function AccessManger_page(_index, _parent, _onOpen) {
	const Parent = _parent
	const HTML = {
		self: $('.accessDisableHolder .page')[_index],
		pages: $('.accessDisableHolder .page'),
	}
	this.index = _index;
	this.isOpen = function() {
		return Parent.curPage.index == this.index;
	}

	this.open = function() {
		for (let page of HTML.pages) page.classList.add('hide');
		HTML.self.classList.remove('hide');
		Parent.curPage = this;
		Parent.open();

		try {
			_onOpen();
		} catch (e) {}
	}
}




function AccessManger_disabledPage(_parent) {
	AccessManger_page.call(this, 0, _parent, onOpen);
	const Parent = _parent;
	const This = this;
	const HTML = {
		reasonHolder: $('.accessDisableHolder .page .textHolder .text.reasonHolder')[0]
	}

	function onOpen() {
		This.updateStatus();
		if (!This.disabled) return Parent.close();
	}

	this.disabled = false;
	this.enableAccess = function() {
		this.disabled = false;
		Parent.close();
	}

	this.disableAccess = function() {
		this.disabled = true;
		Parent.open();
		for (let element of document.getElementsByTagName('video')) element.pause();
	}

	this.updateStatus = function() {
		if (!this.isOpen()) return;
		this.enableAccess();
		let disable = shouldBeDisabled(Parent.allowedTimeDomains);
		if (disable) 
		{
			this.disableAccess();
			setDisabledReason('Outside the allowed timedomains.');
		} else if (Parent.getTotalTimeToday() >= Parent.maxTotalTime) 
		{
			this.disableAccess();
			setDisabledReason('Timelimit exceeded (' + Parent.getTotalTimeToday() + " minutes of " + Parent.maxTotalTime + " minutes)");
		}
	}

	function shouldBeDisabled(_allowedTimeDomains) {
		let curTime = new Date().getTimeInMinutes();
		for (let domain of _allowedTimeDomains)
		{
			if (domain[0] > curTime || domain[1] < curTime) continue;
			return false;
		}
		return true;
	}

	function setDisabledReason(_text) {
		setTextToElement(HTML.reasonHolder, _text);
	}	
}

function AccessManger_settingsPage(_parent) {
	AccessManger_page.call(this, 1, _parent, onOpen);
	const This = this;
	const Parent = _parent;
	const HTML = {
		domainHolder: $('.accessDisableHolder .page .domainHolder')[0]
	}

	function onOpen() {
		This.render();
	}


	this.render = function() {
		HTML.domainHolder.innerHTML = '';

		for (let i = 0; i < Parent.allowedTimeDomains.length; i++)
		{
			HTML.domainHolder.append(renderDomainHTML(Parent.allowedTimeDomains[i], i));
		}
	}



	function renderDomainHTML(_domain, _index) {
		let html = document.createElement('div');
		html.classList.add('domainItem');

		html.innerHTML = 	'<div class="text title"></div>' + 
							'<img class="icon text" src="https://florisweb.ga/YTWrapper/images/removeIconLight.png">';

		let timeString = new Date().setTimeFromMinutes(_domain[0]).formatTime() + " ➔ " + new Date().setTimeFromMinutes(_domain[1]).formatTime()
		setTextToElement(html.children[0], timeString);

		html.children[1].onclick = function() {
			Parent.allowedTimeDomains.splice(_index, 1);
			localStorage.allowedTimeDomains = JSON.stringify(Parent.allowedTimeDomains);
			This.render();
		}

		return html;
	}
	




}
















