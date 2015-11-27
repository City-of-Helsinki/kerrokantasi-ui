// This script ensures that the `src` path is in `NODE_PATH` before
// test runners are run. This is currently required for isparta to work
// correctly.
var path = require("path");
var fs = require("fs");

var nodePath = process.env["NODE_PATH"] || "";
nodePath = (nodePath.length ? nodePath.split(path.separator) : []);
nodePath.unshift(path.resolve(__dirname, "src"));
nodePath = process.env["NODE_PATH"] = nodePath.join(path.separator);

// Then do some very rudimentary arg parsing and exec the actual test runner.
var args = require('minimist')(process.argv.slice(2), opts={"--": true});
if(args.cov) {
	cmdline = [
		"./node_modules/babel-cli/bin/babel-node.js",
		"./node_modules/isparta/bin/isparta",
		"cover",
		"./node_modules/mocha/bin/_mocha",
		"--",
		"--recursive"
	];
} else {
	cmdline = [
		"./node_modules/mocha/bin/_mocha",
		"--compilers", "js:babel-register",
		"--recursive",
		"--require", "./test/setup.js"
	];
}
cmdline = cmdline.concat(args["--"] || []);
// This isn't exactly exec, but it's the best we seem to be able to do
require("child_process").spawnSync("node", cmdline, {stdio: 'inherit', cwd: __dirname});
if(args.coveralls && fs.existsSync("coverage/lcov.info")) {
	require("coveralls").handleInput(
		fs.readFileSync("coverage/lcov.info", "utf8"), function(err) {
			if(err) console.log("Coveralls: " + err);
		}
	);
}
