const { MapReduceSlave } = require('./MapReduce');
const mapReduceSlave = new MapReduceSlave({port: 1235, name: 'slave 2'});

mapReduceSlave.onMap((mapper) => {
  return data.map(mapper);
});

const data = [
  {
    "id": "1",
    "name": "Viktor",
    "text": "Wow"
  }
];