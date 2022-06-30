#!/usr/bin/env node

"use strict";

const args = require("minimist")(process.argv.slice(2), {
  boolean: ["help", "in"],
  string: ["file"],
});

const path = require("path");
const fs = require("fs");
const getStdin = require("get-stdin");
const util = require("util");

const BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname);

if (process.env.HELLO) {
  console.log(process.env.HELLO);
}

if (args.help) {
  printHelp();
} else if (args.in || args._.includes("-")) {
  getStdin().then(processFile).catch(error);
} else if (args.file) {
  fs.readFile(path.join(BASE_PATH, args.file), (err, content) => {
    if (err) {
      error(err.toString());
    } else {
      processFile(content.toString());
    }
  });
} else {
  error("incorrect usage", true);
}

function processFile(content) {
  content = content.toUpperCase();
  process.stdout.write(content);
}

function error(msg, includeHelp = false) {
  console.error(msg);
  if (includeHelp) {
    console.log("");
    printHelp();
  }
}

function printHelp() {
  console.log("usage:");
  console.log("   node-hello.js --file={FILENAME}");
  console.log("");
  console.log("--help                 print this help");
  console.log("--file                 process the file");
  console.log("--in, -                 process stdin");
  console.log("");
}
