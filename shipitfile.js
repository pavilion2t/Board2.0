



module.exports = function(shipit) {
	var git = require('git-rev')
	var utils = require('shipit-utils');
	var gitsync = require('git-rev-sync');
	var branch = gitsync.branch();
	var branchFolder =  branch.split('/').pop().toLowerCase();

	shipit.initConfig({
		staging: {
			servers: ['frontend@web1.stg.us1.bindolabs.com', 'frontend@web2.stg.us1.bindolabs.com']
		},
		'staging-new': {
			servers: ['deploy@dashboard1.c.bindo-staging-tw.internal', 'deploy@dashboard2.c.bindo-staging-tw.internal']
		},
		production: {
			servers: ['frontend@web1.prd.us2.bindolabs.com', 'frontend@web2.prd.us2.bindolabs.com']
		},
		'production-new': {
			servers: ['deploy@dashboard1.c.bindo-production-tw.internal', 'deploy@dashboard2.c.bindo-production-tw.internal']
		},
		'staging2': {
			deployTo: '/opt/dashboard-branch/d2',
			servers: ['deploy@dashboard1.c.bindo-staging-tw.internal', 'deploy@dashboard2.c.bindo-staging-tw.internal']
		},
		'production2': {
			deployTo: '/opt/dashboard-branch/d2',
			servers: ['deploy@dashboard1.c.bindo-production-tw.internal', 'deploy@dashboard2.c.bindo-production-tw.internal']
		}
	});

	shipit.task('pwd', function() {
		return shipit.remote('pwd');
	});

	shipit.task('ls', function() {
		return shipit.remote('ls -l /opt/dashboard');
	});

	// only works with production server
	shipit.task('deploy', function() {
		var timestamp = new Date().toISOString();

		shipit
		.remote('pwd')
		.then(function() {
			return shipit.remoteCopy('./dist/', '/opt/dashboard/build-' + timestamp);
		})
		.then(function() {
			return shipit.remote('rm /opt/dashboard/release && ln -s /opt/dashboard/build-' + timestamp + ' ' + '/opt/dashboard/release');
		})
		.then(function(res) {
			console.log('deploy complete');
		});
	});

	// only works with production server
	shipit.task('deploy-next', function() {
		var timestamp = new Date().toISOString();

		shipit
		.remote('pwd')
		.then(function() {
			return shipit.remoteCopy('./dist/', '/opt/dashboard-next/build-' + timestamp);
		})
		.then(function() {
			return shipit.remote('rm /opt/dashboard-next/release && ln -s /opt/dashboard-next/build-' + timestamp + ' ' + '/opt/dashboard-next/release');
		})
		.then(function(res) {
			console.log('deploy complete');
		});

	})

	// only works with staging server
	shipit.task('deploy-branch', function() {
		git.branch(function(branch) {

			var folder = branch.split('/').pop() // last segment of branch

			shipit
			.remote('pwd')
			.then(function() {
				return shipit.remoteCopy('./dist/', '/opt/dashboard/dist');
			})
			.then(function() {
				return shipit.remote('rm -rf /opt/dashboard/release/' + folder);
			})
			.then(function() {
				return shipit.remote('mv -f /opt/dashboard/dist /opt/dashboard/release/' + folder);
			})
			.then(function(res) {
				console.log('deploy complete');
			});
		})
	});

	// only works with staging server
	shipit.task('deploy-branch-new', function() {
		git.branch(function(branch) {

			var branchFolder = branch.split('/').pop().toLowerCase()
			var destFolder = '/opt/dashboard-branch/d1/' + branchFolder;

			shipit
			.remote('pwd')
			.then(function() {
				return shipit.remote('if [ -d ' + destFolder + ' ]; then rm -rf ' + destFolder + '; fi');
			})
			.then(function() {
				return shipit.remoteCopy('./dist/', destFolder);
			})
			.then(function(res) {
				console.log('deploy complete');
				console.log('online url: ', branchFolder+'.d1.dashboard.trybindo.com')
			});
		});
	});

	// only works with staging server
	shipit.task('deploy-branch-codeship', function() {
		var branch = process.env.CI_BRANCH;
		var folder = branch.split('/').pop() // last segment of branch

		shipit
		.remote('pwd')
		.then(function() {
			return shipit.remoteCopy('./dist/', '/opt/dashboard/dist');
		})
		.then(function() {
			return shipit.remote('rm -rf /opt/dashboard/release/' + folder);
		})
		.then(function() {
			return shipit.remote('mv -f /opt/dashboard/dist /opt/dashboard/release/' + folder);
		})
		.then(function(res) {
			console.log('deploy complete');
		});
	});



	shipit.task('deploy2', function() {
		var timestamp = new Date().toISOString();
		var destFolder = shipit.config.deployTo + '/build-' + timestamp;
		var linkFolder = shipit.config.deployTo + '/current';

		shipit
		.remote('pwd')
		.then(function() {
			return shipit.remoteCopy('./dist/', destFolder);
		})
		.then(function() {
			return shipit.remote('if [ -d ' + linkFolder + ' ]; then rm -rf ' + linkFolder +'; fi');
		})
		.then(function(){
			return shipit.remote('ln -s ' + destFolder + ' ' + linkFolder);
		})
		.then(function(res) {
			console.log('deploy complete');
		});
	});

	shipit.task('deploy-branch2', function() {
		var destFolder = shipit.config.deployTo + '/' + branchFolder;

		shipit
		.remote('pwd')
		.then(function() {
			return shipit.remote('if [ -d ' + destFolder + ' ]; then rm -rf ' + destFolder + '; fi');
		})
		.then(function() {
			return shipit.remoteCopy('./dist/', destFolder);
		})
		.then(function(res) {
			console.log('deploy complete');
			var url = '';
			if (branchFolder === 'master') {
				url = `https://dashboard.bindo.com'`;
			} else if (branchFolder === 'development') {
				url = `https://dashboard.trybindo.com'`;
			} else {
				url = `https://${branchFolder}.d2.dashboard.trybindo.com`;
			}
			console.log(`online url: ${url}`);
		});
	});

};
