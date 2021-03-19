const inquirer = require('inquirer');
const exec = require('child_process').exec;

const DELETE_FLAG = '-D';
const flags = [DELETE_FLAG];

const foundFlags = process.argv.find(arg => flags.find(flag => flag === arg));

const prompt = branchList => ([{
	choices: branchList,
	default: 'default',
	message: 'message',
	name: 'name',
	type: 'list',
}]);

const processAnswers = ({ name }) => {
	if (foundFlags === DELETE_FLAG) {
		// Ask for confirmation
		exec('git branch -D ' + name, () => console.log('Branch "' + name + '" has been deleted.'));
		return;
	}

	exec('git checkout ' + name);
	console.log('Changed to branch: ' + name);
	return;
}

const catchError = error => {
	console.log('error: ', error);
}

exec('git branch', (err, out, _err) => {
	const branchList = out.replace(/ /g, '')
		.split('\n').filter(a => a);

	inquirer
		.prompt(prompt(branchList))
		.then(processAnswers)
		.catch(catchError);
});
