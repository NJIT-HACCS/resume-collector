import AWS from 'aws-sdk';

const uploadFile = async (file) => {
  const S3_BUCKET = process.env.REACT_APP_AWS_S3_BUCKET;
  const REGION = process.env.REACT_APP_AWS_REGION;

  AWS.config.update({
    signatureVersion: 'v4',
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: REGION
  });

  const s3 = new AWS.S3();

  const params = {
    Bucket: S3_BUCKET,
    Key: file.name,
    Body: file,
    ContentType: file.type
  };

  try {
    await s3.upload(params).promise();
    // Construct the S3 URL manually
    const s3Url = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${encodeURIComponent(file.name)}`;
    //console.log("inside uploadFile: ", s3Url);
    return s3Url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export default uploadFile;