const { MapReduceMaster } = require('./MapReduce');

const mapReduceMaster = new MapReduceMaster({
  port: 1233,
  name: 'master',
  slavePorts: [1234, 1235, 1236],
});

mapReduceMaster
