const fs = require('fs');
const path = require('path');

// Dynamic import for AWS SDK
async function runDeploy() {
  let S3Client, PutObjectCommand;
  try {
    const s3 = require('@aws-sdk/client-s3');
    S3Client = s3.S3Client;
    PutObjectCommand = s3.PutObjectCommand;
  } catch (e) {
    console.error('Installing @aws-sdk/client-s3...');
    require('child_process').execSync('npm install @aws-sdk/client-s3 --no-save', { stdio: 'inherit' });
    const s3 = require('@aws-sdk/client-s3');
    S3Client = s3.S3Client;
    PutObjectCommand = s3.PutObjectCommand;
  }

  const region = process.env.AWS_REGION || 'ap-south-1';
  const bucketName = process.env.AWS_S3_BUCKET;

  if (!bucketName) {
    console.error('\n❌ Error: AWS_S3_BUCKET is not set!');
    console.error('\nRun the deploy command with your bucket details:');
    console.error('  $env:AWS_S3_BUCKET="your-s3-bucket-name"; $env:AWS_REGION="ap-south-1"; node deploy-s3.js\n');
    process.exit(1);
  }

  const s3Client = new S3Client({ region });

  function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
      case '.html': return 'text/html; charset=utf-8';
      case '.css':  return 'text/css; charset=utf-8';
      case '.js':   return 'application/javascript; charset=utf-8';
      case '.jpg':
      case '.jpeg': return 'image/jpeg';
      case '.png':  return 'image/png';
      case '.webp': return 'image/webp';
      case '.svg':  return 'image/svg+xml';
      case '.json': return 'application/json';
      default:      return 'application/octet-stream';
    }
  }

  function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
      const fullPath = path.join(dirPath, file);
      if (file.startsWith('.') || file === 'node_modules' || file === 'assets.zip' || file === 'deploy-s3.js' || file === 'package.json' || file === 'package-lock.json') return;
      if (fs.statSync(fullPath).isDirectory()) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      } else {
        arrayOfFiles.push(fullPath);
      }
    });
    return arrayOfFiles;
  }

  const rootDir = __dirname;
  const files = getAllFiles(rootDir);
  console.log(`\n🚀 Deploying ${files.length} files to AWS S3 bucket: "${bucketName}" (Region: ${region})...\n`);

  let successCount = 0;
  for (const filePath of files) {
    const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
    const fileContent = fs.readFileSync(filePath);
    const contentType = getContentType(filePath);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: relativePath,
      Body: fileContent,
      ContentType: contentType
    });

    try {
      await s3Client.send(command);
      console.log(`  ✓ Uploaded: ${relativePath}`);
      successCount++;
    } catch (err) {
      console.error(`  ❌ Failed: ${relativePath} -> ${err.message}`);
    }
  }

  console.log(`\n🎉 S3 Deployment complete! (${successCount}/${files.length} files successfully uploaded)\n`);
}

runDeploy();
