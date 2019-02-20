const { MapReduceClient } = require('./src/MapReduce');

(async function () {
  const mapReduce = new MapReduceClient({ masterPort: 1233 });

  const result = await mapReduce
  .map((el) => {
    return el.text
      .split(' ')
      .map(word=> word.toLowerCase())
      .map(word => ({ key: word, value: 1 }))
  })
  .reduce((acc, prev) => prev + acc, 0);

  console.log(result);
})();