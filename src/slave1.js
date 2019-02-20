const { MapReduceSlave } = require('./MapReduce');
const mapReduceSlave = new MapReduceSlave({port: 1234, name: 'slave 1'});

mapReduceSlave.onMap((mapper) => {
  return data.map(mapper);
});

const data = [
  {
    "id": "1",
    "name": "Anton",
    "text": "hello world"
  }
];