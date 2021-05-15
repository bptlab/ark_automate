# General

There is a clear separation of the server side of the application and the client side (`frontend`). Therefore, next to the README and some config files, there are only four folders in the top structure:

- A **frontend/** folder with its own package.json. There you can find everything regarding the React frontend.
- A **server/** folder with its own package.json. There you can find everything regarding the Node backend and the communication with the database.
- A **wiki/** folder which contains all wiki-documents as Markdown file. The pages can be edited in this folder and will be deployed to the wiki on merge to the `main` branch.
- A **.github/** folder which contains all workflows, our issue & pull request templates as well as some notes for the open source project.

The local client which is required to run the created robots is located in a [separate repository](https://github.com/bptlab/ark_automate_local).

## server

The basic structure is explained [here](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes).
The central file here is the **server.js**. Here all the different routers are being used.

- **routes/**: All the different routers are implemented here. For different routes there are different routers.
  Each router forwards the corresponding HTTP request to an appropriate controller by calling a suitable function of the controller.
- **controllers/**: In the controllers the HTTP request actually gets handled. While handling the request the functions in controllers use supporting functions from the folder services and data models from the folder models. Test files for a controller should be put right next to the controller file and both should be wrapped in a folder that is named like the controller file.
- **models/**: Schemas and models are being stored here which interact with a database (in our case MongoDB).
- **services/**: Functionality that is being used in the controllers. Test files for a service file should be put right next to the service file and both should be wrapped in a folder that is named like the service file.
- **utils/**: Helper functions.

## frontend

On the top level there are only two folders next to the package.json and package-lock.json as well as some more config files.
The **public/** folder contains the known meta information of a web page, as well as the favicon.
Let's focus on the **src/** folder. On the highest level the relevant file is the **index.js**. Here our single page react application gets rendered. Also, there are many folders on the highest level within the src folder:

- **api/**: API call related functions.
- **components/**: Stateful and stateless components. On the highest level the relevant file is the App.js. It is the one component that is being rendered in the end and that includes all the other components. In general the test and CSS file for a component are saved together with the component in one folder that contains just these files. If multiple test files are needed to test one component then put all the test files in one tests folder next to the component.  
  Next to the App.js there is a folder in the `components/` folder that contains all the pages of the application. In addition, the `HeaderNavbar/` folder contains the navigation bar that is imported from each page.  
  In the pages folder, a subfolder is created for each page. the following folder structure is done logically hierarchically according to the order of imports.
- **layout/**: Contains our corporate design and customized theme.
- **resources/**: Contains images, fonts and other static files.
- **utils/**: Contains the following subfolders:
  - **componentsFunctionality/**: Here all functionalities of React components are outsourced to keep the pure `.jsx` files as small as possible.
  - **parser/**: Contains our three parsers, which are stored in the frontend. Each parser has its own subfolder that also contains its tests
  - **rpaFunctionality/**: #todo
  - **sessionStorageUtils/**: Contains all the helper files we need to interact with the session storage
  - **socket/**: #todo

# Naming conventions

- All components are saved as .jsx files (including index.jsx and App.jsx)
- All non-component JavaScript files are saved as .js
- Component names are written in _PascalCase_
- Non-component JavaScript files are written in _camelCase_
- The folders that directly wrap the component, and it's test and CSS files are also written in _PascalCase_ and have the same name as the wrapped component.
