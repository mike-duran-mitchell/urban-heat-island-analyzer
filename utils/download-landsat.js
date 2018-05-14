const zlib = require("zlib");
const https = require("https");
const fs = require("fs");
const { Transform } = require("stream");

const reportProgress = new Transform({
  transform(chunk, encoding, callback) {
    process.stdout.write(".");
    callback(null, chunk);
  }
});

const gsURLFixer = url =>
  str.replace("gs://", "https://storage.googleapis.com/");

const googleDataRequest = https.get(
  "https://storage.googleapis.com/gcp-public-data-landsat/index.csv.gz"
);
googleDataRequest.on("response", response => {
  const output = fs.createWriteStream("../data/landsat8-map-sources/google-landsat8.csv");

  switch (response.headers["content-encoding"]) {
    // or, just use zlib.createUnzip() to handle both cases
    case "gzip":
      response.pipe(zlib.createGunzip()).pipe(output);
      break;
    case "deflate":
      response.pipe(zlib.createInflate()).pipe(output);
      break;
    default:
      response.pipe(output);
      break;
  }
});

const amazonDataRequest = https.get(
  "https://landsat-pds.s3.amazonaws.com/c1/L8/scene_list.gz"
);
amazonDataRequest.on("response", response => {
  const output = fs.createWriteStream("../data/landsat8-map-sources/amazon-landsat8.csv");

  switch (response.headers["content-encoding"]) {
    // or, just use zlib.createUnzip() to handle both cases
    case "gzip":
      response.pipe(zlib.createGunzip()).pipe(output);
      break;
    case "deflate":
      response.pipe(zlib.createInflate()).pipe(output);
      break;
    default:
      response.pipe(output);
      break;
  }
});
