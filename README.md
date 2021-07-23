# Ark Automate

[![GitHub stars](https://img.shields.io/github/stars/bptlab/ark_automate)](https://github.com/bptlab/ark_automate)
[![GitHub open issues](https://img.shields.io/github/issues/bptlab/ark_automate)](https://github.com/bptlab/ark_automate/issues)
[![GitHub open pull requests](https://img.shields.io/github/issues-closed/bptlab/ark_automate)](https://github.com/bptlab/ark_automate/issues)
[![GitHub open pull requests](https://img.shields.io/github/issues-pr/bptlab/ark_automate)](https://github.com/bptlab/ark_automate/issues)
[![heroku](https://heroku-badge.herokuapp.com/?app=ark-automate&root=App.js)](https://heroku-badge.herokuapp.com/App.js)

Ark-Automate is a platform that allows office users and software developers to automate business or everyday processes by simply sketching the steps of their process. By using simple flowcharts or powerful BPMN in their process outlines, users can create small software solutions using RPA that finish their tasks much faster and more reliably.

## Quick Links

[Wiki](https://github.com/bptlab/ark_automate/wiki) | 
[Tutorial](https://github.com/bptlab/ark_automate/wiki/tutorial) | 
[Screencast](https://www.youtube.com/watch?v=EIbrYbvtknI)

## Installation using Docker

The easiest way to run a local instance of Ark is using the provided Docker images.

1. Make sure you have Docker installed and running.
1. Download the latest [docker-compose file](https://raw.githubusercontent.com/bptlab/ark_automate/docker-deployment/docker-compose.yml).
1. In your console, navigate to the directory of the downloaded file and run `docker-compose up`. You can add a `-d` to run Ark in the background.
1. [Install](https://github.com/bptlab/ark_automate_local#setup) and run the local client.
1. Navigate to http://localhost:3000/ to access the front-end and to start modeling RPA bots!
1. Do you already know our [tutorial](https://github.com/bptlab/ark_automate/wiki/tutorial)? It will guide you through the creation of your first RPA bot using Ark Automate!

> **What is the local client for?**
> 
> Ark Automate consists of two main components:
> The software responsible for managing bots, divided in a web-based front-end for modeling and starting bots, as well as a back-end.
> The lightweight local client however runs on your computer in the background and listens for new RPA jobs to execute.
> 
> You can skip the step for installing the local client, however, you will then not be able to run bots.

## Product Demo

[![Watch the video](https://i.imgur.com/Q9UTQSY.png)](https://www.youtube.com/watch?v=EIbrYbvtknI)

---

## Local Setup for Development

If you want to contribute to Ark, you can set up a local development environment as follows.
Please install:

1. [Node.js](https://nodejs.org/en/) (at least v10.19) using the [installer](https://nodejs.org/en/download/)
2. [npm](https://www.npmjs.com/get-npm) (at least v6.14) which is normally installed with Node.js
3. [nodemon](https://www.npmjs.com/package/nodemon)(at least v2) using `npm install nodemon -g`

Then to complete the repository setup:

1. Clone this repository using `git clone https://github.com/bptlab/ark_automate.git`
2. Change into the repository folder using `cd ark_automate`
3. Install all dependencies by running `npm install` in the server and frontend directory. You can easily do this by running ` cd server/ && npm install && cd .. && cd frontend/ && npm install && cd ..` in the projects root directory

### Set up Heroku

For this step, an invitation to our Heroku project is necessary. Please create yourself a Heroku account, which you link to your Github profile. Then write a short mail to our team [mailing list](mailto:bpmw2020@gmail.com) to be added to the project.

1. Run in the server directory `npm install -g heroku`
2. Login to Heroku by running `heroku login` and than login to your heroku account
3. Create a new .env file in the server directory
4. Add the MongoDb URI to your .env file by running the following command in the server directory `heroku config:get MONGODB_URI -s -a ark-automate >> .env`

### Setup development tools

Tools being used in this project are [EsLint](https://eslint.org/) and [Prettier](https://prettier.io/). For information on how to configure them see our [coding standards](https://github.com/bptlab/ark_automate/wiki/Coding-standards#tools)

### Run application

Before running, please always make sure to have the most recent module versions installed using `npm install` in the server, as well as the frontend directory.
To run a development preview of the app, navigate to the server directory and run `npm run local` to start the API server, navigate into the frontend folder and run `npm start` again to also start the frontend.
Now check http://localhost:3000/ to have a look at the app.

To run the local client, follow the steps in the [Readme of the local client](https://github.com/bptlab/ark_automate_local#readme).

## Contribute

Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](.github/CONTRIBUTING.md). By participating in this project, you agree to abide by its [Code of Conduct](.github/CODE_OF_CONDUCT.md) at all times.

## Contributors

The main contributors to the project are the four members of the [2020/21 Bachelor Project](https://hpi.de/fileadmin/user_upload/hpi/dokumente/studiendokumente/bachelor/bachelorprojekte/2020_21/FG_Weske_RPA_meets_BPM.pdf) of Professor Weske's [BPT Chair](https://bpt.hpi.uni-potsdam.de) at the [Hasso Plattner Institute](https://hpi.de):

- [Lukas Hüller](https://github.com/lukashueller)
- [Kay Erik Jenß](https://github.com/kej-jay)
- [Sandro Speh](https://github.com/SanJSp)
- [Daniel Woelki](https://github.com/WolfgangDaniel)

These four participants will push the project forward as part of their bachelor's degree until the summer of 2021.  
At the same time our commitment to open source means that we are enabling -in fact encouraging- all interested parties to contribute and become part of its developer community. Regarding Open Source, this project underlays a MIT license which you can find [here](https://github.com/bptlab/ark_automate/blob/main/LICENSE.md)

## Project documentation

Our [architecture](https://github.com/bptlab/ark_automate/wiki/Architecture-in-2021), as well as our current [vision of the project](https://github.com/bptlab/ark_automate/wiki/Vision-for-2021) can be found in our [wiki](https://github.com/bptlab/ark_automate/wiki).
Please also see the [code documentation](https://bptlab.github.io/ark_automate/) on its own website including examples.
