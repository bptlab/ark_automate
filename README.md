# ark_automate

[![GitHub stars](https://img.shields.io/github/stars/bptlab/ark_automate)](https://github.com/bptlab/ark_automate)
[![GitHub open issues](https://img.shields.io/github/issues/bptlab/ark_automate)](https://github.com/bptlab/ark_automate/issues)
[![GitHub open pull requests](https://img.shields.io/github/issues-closed/bptlab/ark_automate)](https://github.com/bptlab/ark_automate/issues)
[![GitHub open pull requests](https://img.shields.io/github/issues-pr/bptlab/ark_automate)](https://github.com/bptlab/ark_automate/issues)
[![heroku](https://heroku-badge.herokuapp.com/?app=ark-automate&root=App.js)](https://heroku-badge.herokuapp.com/App.js)

An open source RPA tool which uses several modeling languages to create bots.

## Installation & Setup

Please try running the latest version of:

- Node.js and npm
- React (`npm install react`) in the root folder and in the client folder
- nodemon (`npm install nodemon -g`)

### Configure Modeler

Go to the root directory and install the following packages with `npm install`:

- bpmn-js
- bpmn-font
- bpmn-js-properties-panel
- camunda-bpmn-moddle

### Set up Heroku
For this step, an invitation to our Heroku project is necessary. Please create yourself a Heroku account, which you link to your Github profile. Then write a short mail to our team [mailing list](mailto:BP2020MW1-intern@hpi.de) to be added to the project.

1. Run in the root directory `npm install -g heroku`
2. Login to Heroku by running `heroku login` and than login to your heroku account
3. Create a new .env file in the root directory
4. Add the MongoDb URI to your .env file by running the following command in the root directory `heroku config:get MONGODB_URI -s -a ark-automate >> .env`

## Run application

Before running, please always make sure to have the most recent module versions installed using `npm install` in the root, as well as the client directory.
To run a development preview of the app, navigate to the root directory and run `heroku local` to start the API server, navigate into the client folder and run `npm start` again to also start the frontend.  
Now check http://localhost:3000/ to have a look at the app.

## Contribute
Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](.github/CONTRIBUTING.md). By participating in this project, you agree to abide by its [Code of Conduct](.github/CODE_OF_CONDUCT.md) at all times.

## Contributors
The main contributors to the project are the four members of the [2020/21 Bachelor Project](https://hpi.de/fileadmin/user_upload/hpi/dokumente/studiendokumente/bachelor/bachelorprojekte/2020_21/FG_Weske_RPA_meets_BPM.pdf) of Professor Weske's [BPT Chair](https://bpt.hpi.uni-potsdam.de) at the [Hasso Plattner Institute](https://hpi.de):
* [Lukas Hüller](https://github.com/lukashueller)
* [Kay Erik Jenß](https://github.com/kej-jay)
* [Sandro Speh](https://github.com/SanJSp)
* [Daniel Woelki](https://github.com/WolfgangDaniel)

These four participants will push the project forward as part of their bachelor's degree until the summer of 2021.  
At the same time our commitment to open source means that we are enabling -in fact encouraging- all interested parties to contribute and become part of its developer community.


