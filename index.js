const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");
const writeFileAsync = util.promisify(fs.writeFile);

inquirer.prompt([
    {
        type: 'input',
        name: 'username',
        message: 'what is your github username?'
    },
    {
        type: "list",
        message: "What is your favorite color",
        name: "method",
        choices: ['green', 'blue', 'pink', 'red']
    }
]).then(function ({ username }) {

    const githubURL = `https://api.github.com/users/${username}`
    axios.get(githubURL)
        .then(({ data }) => {
            console.log(data);
            
        });
})





