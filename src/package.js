
const fs = require('fs');


(async () => {
	let preloadScript = '';

	let css = await getFileContents('../dist/main.css');
	let js = await getFileContents('../dist/main.js');

	preloadScript += `
		console.warn('Preloadscript loaded!');
		async function wait(_ms) {
			return new Promise((resolve) => setTimeout(resolve, _ms));
		}


		\n\n //=== CSS === \n\n
		let cssImporter = document.createElement('style');
		cssImporter.innerHTML = \`` + css + `\`;
		cssImporter.setAttribute('id', 'testId');
		console.warn('Importing CSS');
		window.c = cssImporter;
	`;
	preloadScript += `\n\n //=== JAVASCRIPT === \n\n` + js;


	preloadScript += `
		\n\n\ // === SETUP === \n\n
		wait(100).then(() => 
		{
			document.body.append(cssImporter);
			YTWrapper.setup();
		});
	`;

	fs.writeFile('../dist/preload.js', preloadScript, err => {
	  if (err) {
	    console.error(err);
	  }
	});
})();


async function getFileContents(_path) {
	return new Promise((resolve, error) => {
		fs.readFile(_path, 'utf8', (err, data) => {
			if (err) {
				console.error(err);
				error(err);
				return;
			}
			resolve(data);
		});
	});
}