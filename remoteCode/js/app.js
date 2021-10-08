

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

		this.videoManager.setup();
		this.navBar.setup();
		this.accessManager.setup();
		this.update();
	}

	this.createVideoEmbed = function(_key) {
		let embed = new VideoEmbed({key: _key});
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
		}, 50);
	}
}


function VideoEmbed({key: key}) {
	let url = 'https://youtube.com/embed/' + key;
	url = 'https://youtube.com/watch?v=' + key;

	let element = document.createElement('iframe');
	element.classList.add('videoContainer');
	element.setAttribute('src', url);
	element.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
	element.setAttribute('allowfullscreen', true);
	document.body.append(element);

	element.onload = function() {
		console.log('loaded');
		
		let style = document.createElement('link');
		style.href = 'https://florisweb.dev/YTWrapper/main.css?a=' + Math.round(Math.random() * 100000);
		style.type = 'text/css';
		style.rel = 'stylesheet';

		element.contentDocument.head.append(style);
		element.contentDocument.body.style.border = '5px solid red';
		element.contentDocument.body.classList.add('isVideoTab');
	}
	return element;
}


YTWrapper.setup();