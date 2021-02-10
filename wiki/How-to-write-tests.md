# Testing

## Topics

- Why automatically test?
- Tools
- What to test?
- How to write a test?
- How to execute a test?
- Best practices
- Your next Steps
- Places to continue research





---

### Why automatically test?
**The purpose of testing is to give you confidence that the app is working correctly.**
- Helps to catch bugs earlier
    - You might unknowingly break an app whenever you change a line of code.
- Test your changes faster
    - Manually testing your app after each change is cumbersome.
    - Refactoring is easier
- Tests help document
    - for example edge cases
- Improves the architecture
    - Enforces code splitting and single responsibilities



### Tools
![The tools used often](https://i.imgur.com/sxEsfOJ.png)
There are 2 main competitors for testing utilities: Enzyme and React Testing Library (RTL). Through other research, we found out that Enzyme is not really liked and will be replaced by RTL (react testing library). Pro for Enzyme: it can shallow render. React core team members have expressed their preference for RTL as it's more future proof. Enzyme seems to be faster and with less overhead. 

> React Testing Library approaches testing from a user perspective. Thus it naturally leads to writing integration tests where multiple components are tested together.
> As an example, imagine a button. With React Testing Library you typically wouldn't test if the onClick prop is called when the button is clicked. You would rather test if a specific button triggers a certain effect. Like a delete button opening a confirmation modal.
> With Enzyme in contrast you would test implementation details like the click handler being called or a state variable being updated correctly. This leads to very detailed tests that break easily when you change something unrelated to the overall functionality (e.g. renaming the click handler or state variable).

#### Jest
* Unit testing
* Snapshot testing
    * is useful for making sure that the UI does not change unexpectedly
* Integration testing
* Mocks, Stubs, and Spies ([Dive Deeper](https://youtu.be/GTaVTa4QuAM?t=119))
    * Mock = An object on which you set expectations
    * Stub = Provides predefined answers to method calls
    * Spy = Doesn't change functionality
    * **In general you can simply refer to it as mocking**

Some test examples can be found [here](https://github.com/sapegin/jest-cheat-sheet)

You can also use [this short Jest cheatsheet](https://devhints.io/jest)

#### React Testing Library
* Component testing
    * Testing based on the correct rendering of components
* Simulate user behavior
* Can't access components state

[Which RTL query should I use?](https://testing-library.com/docs/guide-which-query/)
[RTL Cheatsheet](https://raw.githubusercontent.com/testing-library/react-testing-library/master/other/cheat-sheet.pdf)

#### Which testing tool to use
* For everything that is related to rendering components and therefore requires evaluations against the DOM
* If you are only testing functions and methods, please use plain Jest

### What to test?
#### Do 
* Utility methods
* Complex implementations (eg: algorithms)
* Anything that has edge cases
* Core business logic
* Services that are high-risk
* Common user interactions
* Error cases that you expect to happen frequently (such as entering an incorrect password when logging in)
* Interactions between units that were stubbed in the unit tests

#### Don't
* JavaScript and NodeJS core functions
* Third-party libraries
* External applications
* API calls. Stub them unless you’re doing E2E testing
* Database operations, unless you’re doing E2E testing
* Trivial methods not involving logic (simple getters and setters)
* Code that is throw-away or placeholder code

### How to write a test?
- In the same folder of component, create file filename.test.js
    - If there are multiple test files that are responsible for the same JS file, please add a Tests folder on the same structure level as the file to include the test files
- use describe, it, beforeEach, etc.

### How to execute a test?
`npm test` to run tests in client or server folder (doesn't work yet, needs to be added to scripts)


### Best practices
* Tests should be pure (have the same outcome on multiple runs), so mock 
    * API calls
    * Third-party libraries
    * Timers
    * Dates
    * Random values
    * File access
* use constants to assign and evaluate to prevent typos that may cause the test to fail
* Create Tests That Are Resistant to UI Changes
* All tests should be independent of each other - use jest.resetAllMocks(); jest.clearAllMocks();
    * Think about using the built-in afterEach functionality if your Use-Case requires it
* Name your tests wisely. The names should say exactly what the function should do, but not how. This will serve as documentation.
* Find yourself mocking the same function over and over in multiple tests? 
    * Give it default mock responses in \_\_mocks\_\_ folders using Manual Mocks!
* Treat tests like the rest of the code, keep them clean, simple, easy to understand, and maintain and code review them.
* Create tests from the start, it’s easier and will enforce your code to be more modular, easier to understand and maintain
* Don’t create fake/poor tests just for increasing coverage
* Avoid including implementation details in tests




## Next Steps

- [ ] read through [the jest documentation](https://jestjs.io/docs/en/getting-started) (about 15 minutes)
- [ ] Watch this to the end https://youtu.be/MAFGRx0HYKo?t=1971 (10 mins) and [this](https://youtu.be/GTaVTa4QuAM?t=27) to 2:00
- [ ] do [this](https://jkettmann.com/beginners-guide-to-testing-react) tutorial (about 40 mins)


## Places to continue research
- https://www.freecodecamp.org/news/testing-react-hooks/
- https://www.youtube.com/watch?v=JKOwJUM4_RM&feature=youtu.be
- https://www.robinwieruch.de/react-testing-library/
- Jest docs https://jestjs.io/docs/en/getting-started
- RTL Docs https://testing-library.com/docs/react-testing-library/intro/
