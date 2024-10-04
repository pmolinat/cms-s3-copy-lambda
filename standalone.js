const lambda = require('./index.js')

// standalone run
console.log('Running on standalone mode');
const singleEvent = {
    "sourceBucket":"vagrantschoolfiles",
    "destinationBucket":"vagrantschoolfiles",
    "fileKey":"12/08cc6a7d.png",
    "destinationKey":"12-copy/single-08cc6a7d.png",
};
const multipleEvents = [
    {
      "sourceBucket":"vagrantschoolfiles",
      "destinationBucket":"vagrantschoolfiles",
      "fileKey":"12/08cc6a7d.png",
      "destinationKey":"12-copy/multiple1-08cc6a7d.png",
    },
    {
      "sourceBucket":"vagrantschoolfiles",
      "destinationBucket":"vagrantschoolfiles",
      "fileKey":"12/08cc6a7d.png",
      "destinationKey":"12-copy/miltiple2-08cc6a7d.png",
    }
]
const context = {
    fail: (error, msg) => {
        console.log('Context failure', error, msg)
    },
    succeed: () => {
        console.log('Content success')
    },
}
const response = lambda.handler(multipleEvents, context).then(response => {
    console.log(response)
})