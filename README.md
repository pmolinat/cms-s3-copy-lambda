# Reusable Lambda function to copy files on S3

As part of the legacy sites migration we need to be able to copy files
from previous S3 buckets into the new location. 
To optimize the process, the code will allow to process multiple files.

## Deployment
As of now we don't have an automated process to deploy lambda functions.
You need to run `npm install` locally in order to upload the files 
required for the function to run.

## Development
We suggest using docker to develop and test your lambda function. 
You can run the following command to get started.

```
docker run -it --rm \
  -v $(pwd):/app \
  -w /app \
  node:20-alpine /bin/ash
```

## Demo Payload

Snigle event
```json
{
  "sourceBucket":"vagrantschoolfiles",
  "destinationBucket":"vagrantschoolfiles",
  "fileKey":"12/08cc6a7d.png",
  "destinationKey":"12-copy/single-08cc6a7d.png",
}
```

Multiple Files
```json
[
  {
    "sourceBucket":"vagrantschoolfiles",
    "destinationBucket":"vagrantschoolfiles",
    "fileKey":"12/08cc6a7d.png"
  },
  {
    "sourceBucket":"vagrantschoolfiles",
    "destinationBucket":"vagrantschoolfiles",
    "fileKey":"12/08cc6a7d.png",
    "destinationKey":"12-copy/08cc6a7d.png",
  }
]
```