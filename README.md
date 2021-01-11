# ark_automate

[![GitHub stars](https://img.shields.io/github/stars/bptlab/ark_automate)](https://github.com/bptlab/ark_automate)
![GitHub repo size](https://img.shields.io/github/repo-size/bptlab/ark_automate)
[![GitHub issues](https://img.shields.io/github/issues/bptlab/ark_automate)](https://github.com/bptlab/ark_automate/issues)
[![heroku](heroku-badge.herokuapp.com/?app=ark-automate)](ark-automate.herokuapp.com)

An open source RPA tool which uses BPMN to create bots.

## Installation & Setup

Please try running the latest version of:

- Node.js and npm
- React (`npm install react`) in the root folder and in the client folder
- nodemon (`npm install nodemon -g`)

Then install the following tools inside the client directory:

1. React Router DOM (`npm install react-router-dom`)
2. AntDesign (`npm install antd`)

### Configure Modeler

Go to the root directory and install the following packages with `npm install`:

- bpmn-js
- bpmn-font
- bpmn-js-properties-panel
- camunda-bpmn-moddle

### Set up Heroku

1. Run in the root directory `npm install -g heroku`
2. Login to Heroku by running `heroku login` and than login to your heroku account
3. Create a new .env file in the root directory
4. Add the MongoDb URI to your .env file by running the following command in the root directory `heroku config:get MONGODB_URI -s -a ark-automate >> .env`

## Run application

Before running, please always make sure to have the most recent module versions installed using `npm install` in the root, as well as the client directory.
To run a development preview of the app, navigate to the root directory and run `heroku local` to start the API server, navigate into the client folder and run `npm start` again to also start the frontend.  
Now check http://localhost:3000/ to have a look at the app.
