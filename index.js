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
        
            const profileImg = data.avatar_url;
            const userName = data.login;
            const location = data.location;
            const htmlURL = data.html_url;
            const blog = data.blog;
            const userBio = data.bio;
            const publicRepo = data.public_repos;
            const followers = data.followers;
            const stars = data.starred_url;
            const following = data.following;
            
            const everything = [profileImg, userName, location, htmlURL, blog, userBio, publicRepo, followers, stars, following];
            console.log(everything)
        });
})





