
async function watch(_condition) {
	return new Promise((resolve) => {
		loop();
		function loop() {
			if (_condition()) return resolve(_condition());
			setTimeout(loop, 10);
		}
	});
}

async function multipleWatcher(_condition, _onFind) {
	let out = await watch(_condition);
	await _onFind(out);
	return multipleWatcher(_condition, _onFind);
}


