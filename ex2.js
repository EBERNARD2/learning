#!/usr/bin/env node

"use strict";

const args = require("minimist")(process.argv.slice(2), {
  boolean: ["help", "in", "out"],
  string: ["file"],
});

const path = require("path");
const fs = require("fs");
// const getStdin = require("get-stdin");
const util = require("util");
const Transform = require("stream").Transform;

const BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname);

const OUTFILE = path.join(BASE_PATH, "out.txt");

const zlib = require("zlib");

if (process.env.HELLO) {
  console.log(process.env.HELLO);
}

if (args.help) {
  printHelp();
} else if (args.in || args._.includes("-")) {
  processFile(process.stdin);
} else if (args.file) {
  let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
  processFile(stream);
} else {
  error("incorrect usage", true);
}

function processFile(inStream) {
  let outStream = inStream;

  const upperStream = new Transform({
    transform(chunk, enc, next) {
      this.push(chunk.toString().toUpperCase());
      next();
    },
  });

  //instream.pipe(upperStream).pipe(readStream).pipe(outStream);
  outStream = outStream.pipe(upperStream);

  let targetStream;
  if (args.out) targetStream = process.stdout;
  else targetStream = fs.createWriteStream(OUTFILE);

  // const targetStream = process.stdout;
  outStream.pipe(targetStream);
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
  console.log("--out                 print to stdout");
  console.log("--in, -                 process stdin");
  console.log("");
}
