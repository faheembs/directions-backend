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
  const { filename, mimetype, path } = file;
  const s3 = new S3({
    region: configs.region,
    credentials: {
      accessKeyId: configs.accessKey,
      secretAccessKey: configs.secretKey,
    },
  });
  const params = {
    Bucket: configs.bucketName,
    Key: `${folder}/${filename}`, // Specify the folder in the Key parameter
    Expires: 60, //seconds - 1mins
    ContentType: mimetype,
  };
  const url = await s3.getSignedUrlPromise("putObject", params);
  const fileContent = fs.readFileSync(path);
  const { status } = await axios.put(url, fileContent, {
    headers: {
      "Content-Type": mimetype,
      "Content-Length": fileContent.length,
    },
  });
  fs.unlinkSync(path);

  if (status != 200) return false;

  const bucketObjectURL = url.split("?")[0];
  return bucketObjectURL;
};
