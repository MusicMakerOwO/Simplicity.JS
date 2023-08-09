const fs = require('fs');

module.exports = () => {
    const files = fs.readdirSync(`${__dirname}/../Structures/Cache`).filter(file => file !== 'CacheLoader.js' && file.endsWith('.js'));
    const exports = {};
    for (const file of files) {
        const name = file.split('.')[0];
        exports[name] = require(`../Structures/Cache/${file}`);
    }
    return exports;
}