const inquirer = require('inquirer');
const exec = require('child_process').exec;

// Types
const DELETE_FLAG = '-D';
const REMOTE_DELETE_FLAG = '-R';

// Actions
const deleteFlag = branchName => exec('git branch -D ' + branchName, () => console.log('Branch "' + branchName + '" has been deleted.'));
const remoteDeleteFlag = branchName => exec('git push origin --delete ' + branchName, () => console.log('Branch "' + branchName + '" has been deleted from remote.'));

const flags = [{
	action: deleteFlag,
	type: DELETE_FLAG,
}, {
	action: remoteDeleteFlag,
	type: REMOTE_DELETE_FLAG,
}];

const findFlags = process.argv.find(arg => flags.find(flag => flag.type === arg));

const prompt = branchList => ([{
	choices: branchList,
	default: 'default',
	message: 'message',
	name: 'name',
	type: 'list',
}]);

const processAnswers = ({ name }) => {
	if (findFlags) {
		flags.find(flag => {
			if (flag.type === findFlags) {
				flag.action(name);
				return;
			}
		});
		return;
	}

	// Default action
	exec('git checkout ' + name.replace('*', ''), (err, out, stderr) => {
		// This outputs normal git status, not errors
		console.log(stderr);
	});
	return;
}

// Error handling (not actual handling, just logging);
const catchError = error => {
	console.log('error: ', error);
}

// Main
exec('git branch', (err, out, stderr) => {
	if (stderr) {
		console.log(stderr);
	}

	const branchList = out.replace(/ /g, '')
		.split('\n').filter(a => a);

	inquirer
		.prompt(prompt(branchList))
		.then(processAnswers)
		.catch(catchError);
});
