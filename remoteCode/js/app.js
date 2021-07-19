

const YTWrapper = new function() {
	this.adBlock 		= new YTWrapper_AdBlock();
	this.navBar 		= new YTWrapper_NavBar();
	this.videoManager 	= new YTWrapper_VideoManager();
	this.accessManager 	= new YTWrapper_AccessManager();

	this.setup = async function() {
		console.warn('YTWrapper.setup()');

		// let prevHTML = document.body.innerHTML;

		let wrapper = document.createElement('div');
		wrapper.classList.add('tabWrapper');

		for (let i = document.body.children.length - 1; i >= 0; i--)
		{
			wrapper.append(document.body.children[i]);
		}

		document.body.append(wrapper);


		// let wrapper2 = document.createElement('div');
		// wrapper2.classList.add('tabWrapper');
		// let urlParts = window.location.href.split('?');
		// // wrapper2.innerHTML = await REQUEST.send(urlParts[0], urlParts[1]);
		// wrapper2.innerHTML = await REQUEST.send('https://www.youtube.com');

		// document.body.append(wrapper2);



		// document.body.innerHTML = "<div id='tabHolder'>" + prevHTML + "</div>";


		this.navBar.setup();
		this.accessManager.setup();
		this.update();
	}

	let updates = 0;
  	let lastSlowUpdate = 0;
  	let lastSuperSlowUpdate = 0;

	this.update = function() {
		updates++;
	    if (updates > lastSlowUpdate + 10)
	    {
	      	lastSlowUpdate = updates;
	      	try {
	      		this.adBlock.update();
			} catch (e) {console.error(e);}
			
	      	try {
	    	 	this.videoManager.update();
	  		} catch (e) {console.error(e);}
	    }
	    
	    if (updates > lastSuperSlowUpdate + 60)
	    {
	    	try {
	    		this.accessManager.update();
	    	} catch (e) {console.error(e);}
	      	lastSuperSlowUpdate = updates;
	  	}
		

		setTimeout(function() {
			YTWrapper.update()
		}, 100);
	}

}

YTWrapper.setup();