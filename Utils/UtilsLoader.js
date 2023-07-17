const fs = require('fs');

module.exports = () => {
    let exports = {};
    const files = fs.readdirSync(__dirname).filter(file => file !== 'UtilsLoader.js' && file.endsWith('.js'));
    for (const file of files) {
        const name = file.split('.')[0];
        exports[name] = require(`./${file}`);
    }
    return exports;
}