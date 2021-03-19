const inquirer = require('inquirer');

const DELETE_FLAG = '-D';
const flags = [DELETE_FLAG];

const foundFlags = process.argv.find(arg => flags.find(flag => flag === arg));

const prompt = [{
	choices: ['branch 1', 'branch 2', 'branch 3'],
	default: 'default',
	message: 'message',
	name: 'name',
	type: 'list',
}];

const processAnswers = answers => {
	console.log('answers: ', answers);
	if (foundFlags === DELETE_FLAG) {
		console.log('git branch -D ' + answers.name);
		return;
	}

	console.log('git checkout ' + answers.name);
	return;
}

const catchError = error => {
	console.log('error: ', error);
}

inquirer
	.prompt(prompt)
	.then(processAnswers)
	.catch(catchError);
