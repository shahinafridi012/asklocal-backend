import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// ❗ TEMPORARY TEST VALUES – PUT YOUR REAL VALUES HERE LOCALLY
const AWS_REGION = "eu-north-1";
const AWS_ACCESS_KEY_ID = "AKIAZEH3JNB5TWJDAJ57";
const AWS_SECRET_ACCESS_KEY = "z+QQohQRGT+ecZOSRJYiozoOoMkbNsKHzUVX9DOK";
const AWS_S3_BUCKET = "asklocal-listings-images";
const CLOUDFRONT_URL = "https://d2v1rtdfmyexkf.cloudfront.net";

// 🔥 Create S3 client with hard-coded creds
const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

console.log("AWS KEY:", AWS_ACCESS_KEY_ID);
console.log("AWS SECRET:", AWS_SECRET_ACCESS_KEY ? "Loaded" : "Missing");
console.log("AWS REGION:", AWS_REGION);
console.log("AWS BUCKET:", AWS_S3_BUCKET);

export const uploadToS3 = async (file: Express.Multer.File) => {
  const bucket = AWS_S3_BUCKET;
  const key = `listings/${uuidv4()}-${file.originalname}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  // ✅ Use CloudFront instead of direct S3 URL
  return `${CLOUDFRONT_URL}/${key}`;
};
