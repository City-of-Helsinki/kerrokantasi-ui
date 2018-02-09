const git = require('simple-git')();
const path = require('path');
const fs = require('fs');

var base_checkout_path = 'assets/plugins';

if (process.argv.length > 2) {
    base_checkout_path = process.argv[2]
}

repositories = [{repo:'https://github.com/jvanamo/kerrokantasi-citybikes', directory:'kerrokantasi-citybikes'},
                {repo:'https://github.com/jvanamo/kerrokantasi-budgeting', directory:'kerrokantasi-budgeting'},
                {repo:'https://github.com/jvanamo/kerrokantasi-bikeracks', directory:'kerrokantasi-bikeracks'},
                {repo:'https://github.com/City-of-Helsinki/kerrokantasi-winterbiking', directory:'kerrokantasi-winterbiking'}];

for (repo of repositories) {
    var checkout_path = path.posix.join(base_checkout_path, repo.directory);
    clone_repo(repo.repo, checkout_path);
}

function clone_repo(repo, path) {
    if (fs.existsSync(checkout_path)) {
        console.log(`${path} for ${repo} already exists, skipping`)
    } else {
        console.log(`Queuing clone of ${repo} to ${path}`);
        git.clone(repo, path, function(err, output) {
            // On success error will be null, output seems to be run on quiet
            if (err) {
                console.log(`${repo} cloning failed`);
            } else {
                console.log(`${repo} cloning finished`);
            }
        });
    }
}
