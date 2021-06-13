
function YTWrapper_AccessManager() {
	let HTML = createHTML();


	function createHTML() {
		let holder = document.createElement('div');
		holder.className = 'accessDisableHolder hide';
		holder.innerHTML = 	"<div class='textHolder'>" + 
								"<div class='text header'>DISABLED</div>" + 
								"<div class='text'>Time's up</div>" + 
							"</div>";


		document.body.append(holder);
		return {
			holder: holder,
			disabledReasonHolder: holder.children[1]
		}
	}


	this.allowedDomains = [ // [startMinute, stopMinute]
		[720, 780]
	];
	this.timeHistory = {}; // '12-6-2021': [[0, 50], [100, 120]],

	this.maxTotalTime = 60; // minutes


	this.setup = function() {
		if (localStorage.timeHistory) this.timeHistory = JSON.parse(localStorage.timeHistory);
		let disable = shouldBeDisabled(this.allowedDomains);
		if (disable) 
		{
			this.disableAccess();
			setDisabledReason('Outside the allowed timedomains.');
		} else if (getTotalTimeToday() > this.maxTotalTime) 
		{
			this.disableAccess();
			setDisabledReason('Timelimit exceeded (' + getTotalTimeToday() + " > " + this.maxTotalTime + ")");
		}
	}


	
	this.update = function() {
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

		if (!addedEntry) curEntry = [[curTime, curTime]];
		this.timeHistory[curDate] = curEntry;
		localStorage.timeHistory = JSON.stringify(this.timeHistory);
		console.log('total', getTotalTimeToday());
	}

	function getTotalTimeToday() {
		let curDate = new Date().toString();
		let curEntry = YTWrapper.accessManager.timeHistory[curDate];
		if (!curEntry) return 0;
		let total = 0;
		for (let domain of curEntry) total += domain[1] - domain[0];
		return total;;
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
		setTextToElement(HTML.disabledReasonHolder, _text);
	}



	this.enableAccess = function() {
		HTML.holder.classList.add('hide');
	}

	this.disableAccess = function() {
		HTML.holder.classList.remove('hide');
	}
}