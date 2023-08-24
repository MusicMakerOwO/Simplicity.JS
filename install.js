const fs = require('fs');

const BlacklistFiles = [
    'package.json',
    'package-lock.json',
    'index.js',
    'commands',
]

// check for read and write access
try {
    fs.accessSync('./', fs.constants.R_OK | fs.constants.W_OK);
} catch (err) {
    return console.log('\x1b[31mInstallation cancelled - Missing read/write permissions in current directory.');
}

let currentDir = process.cwd();

let files = fs.readdirSync(currentDir);

if (files.some(file => BlacklistFiles.includes(file))) {
    return console.log('\x1b[31mInstallation cancelled - Not permitted to install over pre-made project.');
}

// copy all files and folders from template to current directory
copy(`${__dirname}/Template`, currentDir);
function copy(src, dest) {
    let stats = fs.statSync(src);

    if (!stats.isDirectory()) {
        fs.copyFileSync(src, dest);
    } else {
        fs.mkdirSync(dest, {
            recursive: true
        });

        let files = fs.readdirSync(src);

        for (let file of files) {
            copy(`${src}/${file}`, `${dest}/${file}`);
        }
    }

}

console.log(`\x1b[32mSuccessfully installed Simplicity!\x1b[0m`);