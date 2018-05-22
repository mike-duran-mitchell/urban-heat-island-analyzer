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

const gzipHandler = (response, outputStream) => {
  const output = fs.createWriteStream(outputStream);

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
};

const gs = "https://storage.googleapis.com/";

const googleDataRequest = https.get(
  "https://storage.googleapis.com/gcp-public-data-landsat/index.csv.gz"
);
googleDataRequest.on("response", response =>
  gzipHandler(response, __dirname + "/landsat8/map-sources/google.csv")
);

const amazonDataRequest = https.get(
  "https://landsat-pds.s3.amazonaws.com/c1/L8/scene_list.gz"
);
amazonDataRequest.on("response", response =>
  gzipHandler(response, __dirname + "/landsat8/map-sources/amazon.csv")
);

const wrs2ShapefileDataRequest = https.get(
  "https://landsat.usgs.gov/sites/default/files/documents/wrs2_descending.zip"
);
wrs2ShapefileDataRequest.on("response", response =>
  gzipHandler(response, __dirname + "/landsat8/wrs2-shapefiles/wrs2_descending.zip")
);
