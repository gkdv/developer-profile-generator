const fs = require("fs");
const axios = require('axios');
const inquirer = require('inquirer');
const pdf = require('html-pdf');
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

const questions = [
    {
        type: "input"
        , name: "username"
        , message: "Please enter your GitHub username"
    },
    {
        type: "list"
        , name: "color"
        , message: "Which color would you like as the background?"
        , choices: [
            "green"
            , "blue"
            , "pink"
            , "red"
        ]
    }
];

// color picked by user after entering username
inquirer
    .prompt(questions)
    .then(function ({username, color}) {
        const queryUrl = `https://api.github.com/users/${username}`;
        const colors = {
            green: {
                wrapperBackground: "#E6E1C3",
                headerBackground: "#C1C72C",
                headerColor: "black",
                photoBorderColor: "#black"
            },
            blue: {
                wrapperBackground: "#E0FFFF",
                headerBackground: "#87CEFA",
                headerColor: "white",
                photoBorderColor: "#73448C"
            },
            pink: {
                wrapperBackground: "#FFF0F5",
                headerBackground: "#FFB6C1",
                headerColor: "white",
                photoBorderColor: "#FEE24C"
            },
            red: {
                wrapperBackground: "#800000",
                headerBackground: "#DB7093",
                headerColor: "white",
                photoBorderColor: "white"
            }
        };

        // fetching data from the github api
        axios
            .get(queryUrl)
            .then(function ({data}) {

                // destructuring api data from call
                const { avatar_url, login, location, html_url, name, company, blog, bio, public_repos, public_gists, followers, following} = data;

                const html = 
                    `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
                        <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
                        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
                        <title>Document</title>
                        <style>
                            @page {
                                margin: 0;
                            }
                            *,
                            *::after,
                            *::before {
                                box-sizing: border-box;
                            }
                            html, body {
                                padding: 0;
                                margin: 0;
                            }
                            html, body, .wrapper {
                                height: 100%;
                            }
                            .wrapper {
                                background-color: ${colors[color].wrapperBackground};
                                padding-top: 100px;
                            }
                            .bottom {
                                background-color: ${colors[color].wrapperBackground};
                                padding-top: 200px;
                                height: auto;
                            }
                            body {
                                background-color: white;
                                -webkit-print-color-adjust: exact !important;
                                font-family: 'Cabin', sans-serif;
                            }
                            .main {
                                background-color: #e9edee !important;
                                height: auto;
                                padding-top: 30px;
                            }
                            h1, h2, h3, h4, h5, h6 {
                                font-family: 'BioRhyme', serif;
                                margin: 0;
                            }
                            h1 {
                                font-size: 3em;
                            }
                            h2 {
                                font-size: 2.5em;
                            }
                            h3 {
                                font-size: 2em;
                            }
                            h4 {
                                font-size: 1.5em;
                            }
                            h5 {
                                font-size: 1.3em;
                            }
                            h6 {
                                font-size: 1.2em;
                            }
                            .photo-header {
                                position: relative;
                                margin: 0 auto;
                                margin-bottom: -50px;
                                display: flex;
                                justify-content: center;
                                flex-wrap: wrap;
                                background-color: ${colors[color].headerBackground};
                                color: ${colors[color].headerColor};
                                padding: 10px;
                                width: 95%;
                                border-radius: 6px;
                            }
                            .photo-header img {
                                width: 250px;
                                height: 250px;
                                border-radius: 50%;
                                object-fit: cover;
                                margin-top: -75px;
                                border: 6px solid ${colors[color].photoBorderColor};
                                box-shadow: rgba(0, 0, 0, 0.3) 4px 1px 20px 4px;
                                display: block;
                                margin-left: auto;
                                margin-right: auto;
                            }
                            .photo-header h1, .photo-header h2 {
                                width: 100%;
                                text-align: center;
                            }
                            .photo-header h1 {
                                margin-top: 10px;
                            }
                            .container {
                                padding: 50px;
                                padding-left: 100px;
                                padding-right: 100px;
                            }
                            .card {
                                padding: 30px;
                                border-radius: 6px;
                                background-color: ${colors[color].headerBackground};
                                color: ${colors[color].headerColor};
                                margin: 40px;
                                text-align: center;
                            }
                            a, a:hover {
                                text-decoration: none !important;
                                color: inherit;
                                font-weight: bold;
                            }
                            @media print { 
                                body { 
                                    zoom: .50; 
                                } 
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="wrapper">
                                <div class="photo-header">
                                    <img src="${data.avatar_url}">
                                    <h1>Hi!</h1>
                                    <h2>My name is ${data.name}</h2>
                                    <div class="my-3 text-center">
                                        <h6>Currently at ${data.company}</h6>
                                    </div>
                                    <div class="row mb-2">
                                        <div class="col text-right">
                                            <a href="http://maps.google.com/maps?q=${data.location.split(' ').join('+')}"><i class="fas fa-location-arrow"></i>${location}</a>
                                        </div>
                                        <div class="col text-center">
                                            <a href="${data.html_url}"><i class="fab fa-github"></i> GitHub</a>
                                        </div>
                                        <div class="col text-left">
                                            <a href="${data.blog}"><i class="fas fa-paperclip"></i>Blog</a>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="main pt-5 pb-1 px-3 mb-0">
                                        <div>
                                            <h4 style="text-align: center;">${bio}</h4>
                                        </div>
                                        <div class="row mt-4">
                                            <div class="col-6">
                                                <div class="card m-0">
                                                    <h4 class="mb-2">Public Respositories <i class="far fa-sticky-note"></i></h4>
                                                    <h6>${data.public_repos}</h6>
                                                </div>
                                            </div>    
                                            <div class="col-6">
                                                <div class="card m-0">
                                                    <h4 class="mb-2">Followers <i class="fas fa-user-friends"></i></h4>
                                                    <h6>${data.followers}</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row mt-4 mb-5">
                                            <div class="col-6">
                                                <div class="card m-0">
                                                    <h4 class="mb-2">GitHub Stars <i class="far fa-star"></i></h4>
                                                    <h6>${data.public_gists}</h6>
                                                </div>
                                            </div>    
                                            <div class="col-6">
                                                <div class="card m-0">
                                                    <h4 class="mb-2">Following <i class="fas fa-user-friends"></i></h4>
                                                    <h6>${data.following}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bottom">
                                    </div>
                                </div>
                    </body>
                    </html>`
                ;

                var format = { format: 'Letter' };

                // creating an HTML / PDF document 
                pdf.create(html, format).toFile(`./html-pdf/${login}.pdf`, function(err, res) {
                    if (err) return console.log(err);
                    console.log('EUREKA!');
                    console.log(res);
                });

            });
    });