const { MapReduceSlave } = require('./MapReduce');
const mapReduceSlave = new MapReduceSlave({port: 1236, name: 'slave 3'});

mapReduceSlave.onMap((mapper) => {
  return data.map(mapper);
});

const data = [
  {
    "id": "1",
    "name": "Olexandr",
    "text": "Hello from my dear friend"
  }
];