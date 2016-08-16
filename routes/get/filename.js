'use strict';
// var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var execSync = require('child_process').execSync;

var route = function route(req, res, next, abe) {
	var cmd = 'node ' + __dirname.replace(/\/$/, '') + '/../../tasks/migrate-file-name.min.js';

	// console.log('* * * * * * * * * * * * * * * * * * * * * * * * * * * * *')
	// console.log('cmd', cmd)
	// var child = exec(cmd);

	// var migrate = spawn('node ' + __dirname + '/../../tasks/migrate-file-name.min.js');
	// MIGRATE_FOLDER
	var env = Object.create( process.env );
	env.MIGRATE_FOLDER = abe.config.root.replace(/\/$/, '');
	var migrate = spawn('node', [__dirname.replace(/\/$/, '') + '/../../tasks/migrate-file-name.min.js'], { env: env });
	// var migrate = spawn('ls', [__dirname + '/../../tasks/']);
	// var migrate = spawn('node', ['-v']);
	var html = '';

	migrate.stdout.on('data', function(data) {
		console.log( `stdout: ${data}` );
		// if (typeof data === 'string') {
			html += `${data}`.replace(/\n/g, '<br />') + '<br />';
		// }
		// output will be here in chunks
		// res.send(out);
	});

	// or if you want to send output elsewhere
	migrate.stderr.on('data', function(data) {
		console.log( `stderr: ${data}` );
		// res.send(`stderr: ${data}`);
	});

	migrate.stdout.on( 'close', function(data) {
		console.log( `stdout: ${data}` );
	    // console.log( `child process exited with code ${code}` );
	    res.send(html);
	});

	migrate.on( 'exit', function(code) {
		if (code != 0) {
		    console.log( `child process exited with code ${code}` );
        }
	});

	// var cp = exec(cmd, function (err, out, code) {
	// 	if (err instanceof Error) {
	// 		res.send('error');
	// 	}else {
	// 		res.send(out);
	// 	}
	// 	process.exit(code)
	// })
	// cp.stderr.pipe(process.stderr)
	// cp.stdout.pipe(process.stdout)
}

exports.default = route