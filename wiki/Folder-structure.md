# General
There is a clear seperation of the server side of the application and the client side. Therefore next to the gitignore and the Readme file there are only two folders in the top structure:
* One client folder with its own package.json. There you can find everything regarding the react frontend.
* One server folder with its own package.json. There you can find everything regarding the Node backend and the communication with the database.

## server
The basic structure is explained [here](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes).
The central file here is the **server.js**. Here all the different routers are being used. 
* **routes/**: All the different routers are implemented here. For different routes there are different routers. 
Each router forwards the corresponding http request to an appropriate controller by calling a suitable function of the controller. 
* **controllers/**: In the controllers the http request actually gets handled. While handling the request the functions in controllers use supporting functions from the folder services and data models from the folder models. Test files for a controller should be put right next to the controller file and both should be wrapped in a folder that is named like the controller file.
* **models/**: Schemas and models are being stored here which interact with a database (in our case MongoDB).
* **services/**: Functionality that is being used in the controllers. Test files for a service file should be put right next to the service file and both should be wrapped in a folder that is named like the service file.
* **utils/**: Helper functions.

## client
On the top level there are only two folders next to the package.json the puplic folder and the src folder. 
Let's focus on the src folder. On the highest level the relevant file is the **index.js**. Here our single page react application gets rendered. Also there are many folders on the highest level within the src folder:
* **api/**: Api call related functions.
* **assets/**:  Images, fonts and other static files.
* **components/**: Stateful and stateless components. On the highest level the relevant file is the App.js. It is the one component that is being rendered in the end and that includes all the other components. In general the test and css file for a component are saved together with the component in one folder that contains just these files. If multiple test files are needed to test one component then put all the test files in one tests folder next to the component.  
The components aren't structured regarding stateful/stateless characteristics but rather according to the three subfolders:
     * **content/**: All the key components that actually create the webpages content.
     * **layout/**: General layout components that can be used in content components (e.g. special Button).
     * **pages/**: Components that represent a specific webpage.
* **config/**: Config files.
* **context/**: React context components (Context provides a way to pass data through the component tree without having to pass props down manually at every level).
* **hoc/**: React higher order components (Wrapper functions that take components as input and alter the component in a sepcific way)
* **store/**: State management with redux. Two subfolders for actions and reducers.
* **utils/**: Helper functions.

# Naming conventions
* All components are saved as .jsx files (excluding index.js and App.js)
* All non-component JavaScript files are saved as .js 
* Component names are written in _PascalCase_
* Non-component JavaScript files are written in _camelCase_
* The folders that directly wrap the component and it's test and css files are also written in _PascalCase_ and have the same Name as the wrapped component.