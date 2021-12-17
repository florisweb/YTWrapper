
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
									"<div class='addDomainHolder'>" +
										"<input class='inputField text hourInput' placeholder='00' maxlength='2'>" + 
										"<div class='text colon'>:</div>" + 
										"<input class='inputField text minuteInput'placeholder='00' maxlength='2'>" + 
										"<div class='text arrowIcon'>➔</div>" + 
										"<input class='inputField text hourInput' placeholder='00' maxlength='2'>" + 
										"<div class='text colon'>:</div>" + 
										"<input class='inputField text minuteInput' placeholder='00' maxlength='2'>" + 
										"<div class='button bBoxy text'>Add</div>" + 
									"</div>" + 
									"<br><br><br><br>" + 
									"<div class='text button'>Close</div>" + 
								"</div>" +
							"</div>" + 
							"<div class='page hide'>" + 
								"<div class='textHolder'>" + 
									"<div class='text header countDownTimeHolder'>0s</div>" + 
									"<div class='text'>Adding Timedomain...</div>" + 
									"<br>" + 
									"<div class='text button cancelButton'>Cancel</div>" + 
								"</div>" +
							"</div>";

		document.body.append(holder);
		holder.children[0].children[0].children[2].onclick = function () {This.settingsPage.open()};
		holder.children[1].children[0].children[9].onclick = function () {This.disabledPage.open()};

		return {
			holder: holder,
		}
	}


	this.disabledPage 			= new AccessManger_disabledPage(this);
	this.settingsPage  			= new AccessManger_settingsPage(this);
	this.addingTimeDomainPage 	= new AccessManger_addingTimeDomainPage(this);
	this.curPage 				= this.disabledPage;


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
			return _onOpen(...arguments);
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
		domainHolder: $('.accessDisableHolder .page .domainHolder')[0],
		addDomainHolder: $('.accessDisableHolder .page .addDomainHolder')[0],
		addDomainButton: $('.accessDisableHolder .page .addDomainHolder .button')[0],
	}

	const startTimeInput = new TimeInput(HTML.addDomainHolder.children[0], HTML.addDomainHolder.children[2]);
	const endTimeInput = new TimeInput(HTML.addDomainHolder.children[4], HTML.addDomainHolder.children[6]);
	HTML.addDomainButton.onclick = async function() {
		let notCanceled = await Parent.addingTimeDomainPage.open(1000 * 60 * 5);
		if (notCanceled) This.addTimeDomain();
		This.open();
	}


	function onOpen() {
		This.render();
		startTimeInput.reset();
		endTimeInput.reset();
	}


	this.render = function() {
		HTML.domainHolder.innerHTML = '';

		for (let i = 0; i < Parent.allowedTimeDomains.length; i++)
		{
			HTML.domainHolder.append(renderDomainHTML(Parent.allowedTimeDomains[i], i));
		}
	}

	this.addTimeDomain = function() {
		let start = startTimeInput.getTimeInMinutes();
		let end = endTimeInput.getTimeInMinutes();
		if (typeof start != 'number' || typeof end != 'number') return;

		let domain = [start, end];
		Parent.allowedTimeDomains.push(domain);
		localStorage.allowedTimeDomains = JSON.stringify(Parent.allowedTimeDomains);

		this.render();
		startTimeInput.reset();
		endTimeInput.reset();
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

function AccessManger_addingTimeDomainPage(_parent) {
	AccessManger_page.call(this, 2, _parent, onOpen);
	const This = this;
	const Parent = _parent;
	const HTML = {
		countDownTimeHolder: $('.accessDisableHolder .page .countDownTimeHolder')[0],
		cancelButton: $('.accessDisableHolder .page .cancelButton')[0],
	}

	let resolver;
	let promise;
	function onOpen(_timeout) {
		setTimeout(() => {
			resolver(true);
		}, _timeout);

		promise = new StatePromise((resolve) => {
			resolver = resolve;
			HTML.cancelButton.onclick = () => {resolve(false)}
		});
		countDownLoop(_timeout);
		return promise;
	}
	function countDownLoop(_timeout) {
		if (_timeout < 0 || promise.isResolved()) return;
		setTextToElement(HTML.countDownTimeHolder, Math.ceil(_timeout / 1000) + "s");
		setTimeout(countDownLoop, 1000, _timeout - 1000);
	}
}





function StatePromise(func) {
	const This = this;
	this.resolved = false;
	let p = new Promise((res, err) => {
		func(() => {
			This.resolved = true;
			res();
		}, () => {
			This.resolved = true;
			err();
		});
	});
	p.isResolved = () => this.resolved;
	return p;
}




function TimeInput(_hourInput, _minuteInput) {
	this.reset = function() {
		_hourInput.value = null;
		_minuteInput.value = null;
	}
	this.getTimeInMinutes = function() {
		let minutes = parseInt(_hourInput.value) * 60 + parseInt(_minuteInput.value);
		if (isNaN(minutes)) return false;
		return minutes;
	}

	_hourInput.addEventListener('input', function() {
		if (!this.value) return;
		let hour = parseInt(this.value);
		if (hour > 24) hour = 24;
		if (hour < 0) hour = 0;
		this.value = hour;
	});
	_minuteInput.addEventListener('input', function() {
		if (!this.value) return;
		let minute = parseInt(this.value);
		if (minute > 60) minute = 60;
		if (minute < 0) minute = 0;
		this.value = minute;
	});
}







