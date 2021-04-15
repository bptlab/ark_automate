/**
 * @category Server
 * @module
 */
const robotCodeConstants = require('./robotCodeConstants');

/**
 * @description Collects the applications used by the bot
 * @param {Array} elements All the elements from the SSoT
 * @returns {Array} All unique Applications that occur in the ssot
 */
const collectApplications = (elements) => {
  const applications = [];
  if (elements !== undefined && elements.length > 0) {
    elements.forEach((element) => {
      if (
        element.rpaApplication !== undefined &&
        !applications.includes(element.rpaApplication)
      ) {
        applications.push(element.rpaApplication);
      }
    });
  }
  return applications;
};

/**
 * @description Generates the Library Import Code of the .robot file
 * @param {Array} elements All the elements from the SSoT
 * @returns {string} Library Import Code that has to be put in .robot file
 */
const generateCodeForLibraryImports = (elements) => {
  let libraryImports = '';
  const applications = collectApplications(elements);
  if (applications.length > 0) {
    Object.values(applications).forEach((application) => {
      libraryImports += `Library${robotCodeConstants.FOURSPACE}RPA.${application}${robotCodeConstants.LINEBREAK}`;
    });
  }

  return libraryImports;
};

/**
 * TODO
 */
const createLibraryImports = async (attributes) => {
  let parsedCode = '';
  parsedCode += `*** Settings ***${robotCodeConstants.LINEBREAK}`;
  parsedCode += generateCodeForLibraryImports(attributes);

  return parsedCode;
};

module.exports = {
  createLibraryImports,
};
