const { S3Client, CopyObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({ 
    region: process.env.AWS_REGION || 'us-east-1',
    // credentials: {
    //     accessKeyId: '',
    //     secretAccessKey: '',
    // },
});

const copyFile = (event) => {
    const sourceBucket = event.sourceBucket;
    const destinationBucket = event.destinationBucket;
    const fileKey = event.fileKey;
    const destinationKey = event?.destinationKey || fileKey;
    const defaultACL = 'public-read';

    // Copying the object from source bucket to destination bucket
    const copyParams = {
        CopySource: `${sourceBucket}/${fileKey}`,  // Source format: /bucket-name/key
        Bucket: destinationBucket,  // Destination bucket
        Key: destinationKey,  // The destination key (same or different as needed)
        ACL: defaultACL,  // Configure ACL of newly copied object
    };

    // Execute the copy command
    const data = s3.send(new CopyObjectCommand(copyParams));
    return data;
}

const isValidEvent = (event) => {
    return ('sourceBucket' in event) && ('destinationBucket' in event) && ('fileKey' in event)
}

exports.handler = async (event, context) => {
    try {
        // Example event data that triggers the function:
        // {
        //   "sourceBucket": "source-bucket-name",
        //   "destinationBucket": "destination-bucket-name",
        //   "fileKey": "path/to/file.txt",
        //   "destinationKey": "new/path/to/file.txt", // This is optional in case you want to rename the path
        // }

        // [
        //     {
        //         "sourceBucket": "source-bucket-name",
        //         "destinationBucket": "destination-bucket-name",
        //         "fileKey": "path/to/file.txt",
        //         "destinationKey": "optiona/new/path/to/file.txt",
        //     }
        // ]

        const promises = []

        if (!Array.isArray(event)) {
            event = [event]
        }
        
        // process multiple files
        for (const copyEvent of event) {
            if (isValidEvent(copyEvent)) {
                promises.push(copyFile(copyEvent));
            } else {
                context.fail('Error', 'Event validation error. ' + JSON.stringify(copyEvent));
            }
        }

        const requestResults = [];
        const results = await Promise.allSettled(promises);
        for (const promiseResponse of results) {
            // copy the successfully processed copies
            if (promiseResponse.status === 'fulfilled') {
                requestResults.push([promiseResponse.value]);
            }
        }

        // console.log(`File copied successfully from ${fileKey} to ${destinationKey}`);
        context.succeed();
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message: 'File(s) successfully copied', 
                data: requestResults,
            }),
        };
    } catch (error) {
        console.error("Error copying file: ", error);
        context.fail('Error', 'Unable to copy files.');
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'File copy failed', error }),
        };
    }
};
