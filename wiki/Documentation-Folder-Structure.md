# General

There is a clear separation of the server side of the application and the client side (`frontend`). Therefore, next to the README and some config files, there are only four folders in the top structure:

- A **frontend/** folder with its own package.json. There you can find everything regarding the React frontend.
- A **server/** folder with its own package.json. There you can find everything regarding the Node backend and the communication with the database.
- A **wiki/** folder which contains all wiki-documents as Markdown file. The pages can be edited in this folder and will be deployed to the wiki on merge to the `main` branch.
- A **.github/** folder which contains all workflows, our issue & pull request templates as well as some notes for the open source project.

The local client which is required to run the created robots is located in a [separate repository](https://github.com/bptlab/ark_automate_local).

## Server

The basic structure is explained [here](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes).
The central file here is the **server.js**. Here all the different routers are being used.

- **api/**: Contains the routes, models and controllers of our API.
- **socket/**: Contains the socket manager who provides the socket rooms for communication
- **utils/**: Helper functions or files like the SsotToRobotParser, the openApiDocumentation or some testing files

## Frontend

On the top level there are only two folders next to the package.json and package-lock.json as well as some more config files.
The **public/** folder contains the known meta information of a web page, as well as the favicon.
Let's focus on the **src/** folder. On the highest level the relevant file is the **index.js**. Here our single page react application gets rendered. Also, there are many folders on the highest level within the src folder:

- **api/**: API call related functions.
- **components/**: Stateful and stateless components. On the highest level the relevant file is the App.js. It is the one component that is being rendered in the end and that includes all the other components. In general the test and CSS file for a component are saved together with the component in one folder that contains just these files.  
  Next to the App.js there is a folder in the `components/` folder that contains all the pages of the application. In addition, the `multiPageComponents/` folder contains all components that are used by several pages like the navigation bar that gets imported from each page.  
  In the pages folder, a subfolder is created for each page. the following folder structure is done logically hierarchically according to the order of imports. Also some functionalities of React components are outsourced to keep the pure `.jsx` files as small as possible.
- **layout/**: Contains our corporate design and customized theme.
- **resources/**: Contains static files like our `empty bpmn`.
- **utils/**: Contains the following subfolders:
  - **parser/**: Contains our three parsers, which are stored in the frontend. Each parser has its own subfolder that also contains its tests
  - **sessionStorage/**: Contains all the helper files we need to interact with the session storage
  - **socket/**: Contains the socket connection file

# Naming conventions

- All components are saved as .jsx files (including index.jsx and App.jsx)
- All non-component JavaScript files are saved as .js
- Component names are written in _PascalCase_
- Non-component JavaScript files are written in _camelCase_
- The folders that directly wrap the component, and it's test and CSS files are also written in _PascalCase_ and have the same name as the wrapped component.
