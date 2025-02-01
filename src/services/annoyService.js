// const { Annoy } = require("annoy");
const { spawn } = require('child_process');

const dimension = 3; // Example: 3-dimensional vectors
// const annoyIndex = new Annoy(dimension, "angular");

// function addVectorToIndex(id, vector) {
//   annoyIndex.addItem(id, vector);
// }

function buildIndex(vectors, trees = 10) {
  // annoyIndex.build(trees);

  // annoyIndex.save("embeddings.ann");

  // console.log("Annoy index saved as embeddings.ann");

  // console.log("Annoy index built with", trees, "trees");

  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', ['annoy_script.py', 'build', JSON.stringify(vectors), 3]);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      resolve(data.toString()); // Return the response from Python
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      reject(data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(`Python process exited with code ${code}`);
      }
    });
  });
}

function getNearestNeighbors(queryVector, n) {
  // return annoyIndex.getNNsByVector(queryVector, n, -1, true);
}

module.exports = {
  // addVectorToIndex,
  buildIndex,
  getNearestNeighbors,
};
