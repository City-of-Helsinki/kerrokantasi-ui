const git = require('simple-git')();
const path = require('path');
const fs = require('fs');

if (process.argv.length > 2) {
    base_checkout_path = process.argv[2]
}

const repositories = JSON.parse(fs.readFileSync('src/shared_config.json'))['pluginMap'];

console.log("Fetching plugins...")L

for (repo in repositories) {
    var checkout_path = repositories[repo].path;
    clone_repo(repositories[repo].repo, checkout_path);
}

function clone_repo(repo, checkout_path) {
    // UI uses absolute paths, as they contain the URI root
    // we want to relativize them for git clone
    if (path.isAbsolute(checkout_path)) {
        checkout_path = checkout_path.substr(1);
    }
    if (fs.existsSync(path.join(checkout_path, ".git"))) {
        console.log(`${checkout_path} for ${repo} already exists, skipping`);
    } else {
        console.log(`Queuing clone of ${repo} to ${checkout_path}`);
        git.clone(repo, checkout_path, function(err, output) {
            // On success error will be null, output seems to be run on quiet
            if (err) {
                console.log(`${repo} cloning failed`);
            } else {
                console.log(`${repo} cloning finished`);
            }
        });
    }
}
