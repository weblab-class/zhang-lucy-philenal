/**
 * General utility functions
*/


/**
 * Given a name of a wordpack, reads then in and
 * returns them as a list
 */
function getWordPack(name) {
    fetch("./resources/wordpacks/animals.txt")
    .then(response => response.text())
    .then(text => console.log(text))
}

module.exports = getWordPack;

