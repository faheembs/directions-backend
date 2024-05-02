const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const axios = require("axios");

const configs = {
  region: "eu-north-1",
  bucketName: "directions-assets",
  accessKey: "AKIA47CRXZAUHODNAZEV",
  secretKey: "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",
  signatureVersion: "v4",
};

module.exports = uploadToS3 = async (file, folder) => {
  // console.log("file :", file)
  // console.log("folder:", folder)
  const { filename, mimetype, path } = file;
  const s3 = new S3({
    region: configs.region,
    credentials: {
      accessKeyId: configs.accessKey,
      secretAccessKey: configs.secretKey,
    },
  });
  // console.log("S3====", s3);
  const params = {
    Bucket: configs.bucketName,
    Key: `${folder}/${filename}`, // Specify the folder in the Key parameter
    Expires: 60, //seconds - 1mins
    ContentType: mimetype,
  };
  const readFilePromise = (path) => {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', (err, file) => {
        if (err) {
          reject(err);
        } else {
          resolve(file);
        }
      });
    });
  };
  try {
    const url = await s3.getSignedUrlPromise("putObject", params);

    const fileContent = await readFilePromise(path);
    const { status } = await axios.put(url, fileContent, {
      headers: {
        "Content-Type": mimetype,
        "Content-Length": fileContent.length,
      },
    });

    fs.unlinkSync(path);

    if (status !== 200) {
      throw new Error("Failed to upload file to S3.");
    }

    const bucketObjectURL = url.split("?")[0];
    return bucketObjectURL;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error to be caught by the caller
  }
};
