/**
 * @category Client
 * @module
 */

/**
 * @description Will download a given string as a file
 * @param {string} text String that will be the content of the downloaded file
 * @param {string} fileType String that sets the file type of the downloaded file; Use form text/filetype
 * @param {string} fileName String that sets the name of the downloaded file; Use the same filetype as given in the fileType parameter e.g. name.filetype
 * @returns {undefined} The return is not defined
 */
const downloadString = (text, fileType, fileName) => {
  const blob = new Blob([text], { type: fileType });
  const element = document.createElement('a');
  element.download = fileName;
  element.href = URL.createObjectURL(blob);
  element.dataset.downloadurl = [fileType, element.download, element.href].join(
    ':'
  );
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  setTimeout(() => {
    URL.revokeObjectURL(element.href);
  }, 1500);
};

export default downloadString;
