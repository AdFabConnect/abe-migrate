// ./node_modules/.bin/browserify migrate-file-name.js -o migrate-file-name.min.js --full-paths=false --node
var fse = require('fs-extra');
var Walker = require('walker');

var path = process.env.MIGRATE_FOLDER.replace(/\/$/, '') + '/';


var files = [];
function doWalk(dir) {
	console.log(path + dir + '/');
	Walker(path + dir + '/')
	  .filterDir(function(dir, stat) {
		  return true;
	  })
	  .on('file', function(file, stat) {
	  	files.push(file);
	  })
	  .on('error', function(er, entry, stat) {
	    console.log('Got error ' + er + ' on entry ' + entry);
	  })
	  .on('end', function() {
	    var cpt = 0;
	    Array.prototype.forEach.call(files, function(file) {
	    	var newFile = file;
	    	if (file.indexOf('.json')) {
	    		var json = fse.readJsonSync(file, {throws: false});
					if(typeof json !== 'undefined' && json !== null
						&& typeof json.abe_meta !== 'undefined' && json.abe_meta !== null) {
					  Object.keys(json.abe_meta).forEach(function (key) {
					  	if(typeof json.abe_meta[key].abeUrl !== 'undefined' && json.abe_meta[key].abeUrl !== null) {
					  		json.abe_meta[key].abeUrl = json.abe_meta[key].abeUrl.replace(/[0-9]{4}-[0-9]{2}-[0-9]{2}[A-Za-z][0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9A-Za-z]*/, function (match) {
								 return match.replace(/[-:\.]/g, '');
							});

					  		if(typeof json.abe_meta[key].latest !== 'undefined' && json.abe_meta[key].latest !== null
					  			&& typeof json.abe_meta[key].latest.abeUrl !== 'undefined' && json.abe_meta[key].latest.abeUrl !== null) {
					  			json.abe_meta[key].latest.abeUrl = json.abe_meta[key].latest.abeUrl.replace(/[0-9]{4}-[0-9]{2}-[0-9]{2}[A-Za-z][0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9A-Za-z]*/, function (match) {
									return match.replace(/[-:\.]/g, '');
								});
					  		}
					  	}
					  })
						fse.writeJsonSync(file, json, {
							space: 2,
							encoding: 'utf-8'
						});
					}
	    	}
			newFile = newFile.replace(/[0-9]{4}-[0-9]{2}-[0-9]{2}[A-Za-z][0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9A-Za-z]*/, function (match) {
				 return match.replace(/[-:\.]/g, '');
			})
	    	if (file !== newFile) {
		    	fse.move(file, newFile, function (err) {
				  	if (err) {
				  		if (err.code === 'EEXIST') {
					  		console.log('* * * * * * * * * * * * * * * * * * * * * * * * * * * * *')
					  		console.log('file ' + file + ' already exist')
					  		fse.removeSync(file)
				  		}
				  		// return console.error(err);
				  	}
				  	console.log(file, '->', newFile);
				})
	    	}
	    })
	  });

}

doWalk('data');
doWalk('draft');