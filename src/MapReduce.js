const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const safeEval = require('safe-eval');

class MapReduceSlave {
  constructor({port, name}) {
    this.port = port;
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.post('/map', (req, res) => {
      const func = req.body && req.body.func;
      if (func && this.callback) {
        try {
          const executeFunction = safeEval(func);
          const result = this.callback(executeFunction);
          res.send({ success: true, result });
        } catch (error) {
          res.send({ success: false, error });
        }
      } else if (!func) {
        res.send({ success: false, error: 'The function is missing in request!' });
      } else {
        res.send({ success: false, error: 'No callback subscribed yet!' });
      }
    });

    this.app.listen(port, () => {
      console.log(`${name} node started and listen ${port} port!`);
    });
  }

  onMap(callback) {
    this.callback = callback;
  }
}

class MapReduceMaster {
  constructor({ port, name, slavePorts }) {
    this.port = port;
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.post('/map-reduce', async (req, res) => {
      const { mapper, reducer } = req.body;
      const mapResults = await Promise.all(slavePorts.map(async (slavePort) => {
        const resp = await axios.post(`http://127.0.0.1:${slavePort}/map`, { func: mapper });
        const body = resp.data;
        if (body.success) {
          return body.result;
        } else {
          throw body.error;
        }
      }))
      const grouped = this.groupByKey(mapResults);
      const reducerFunction = safeEval(reducer.func);
      try {
        for (const key in grouped) {
          grouped[key] = grouped[key].reduce(reducerFunction,reducer.start);
        }
      } catch (error) {
        res.send({ success: false, error });
      }
      res.send({ success: true, result: grouped });
    });

    this.app.listen(port, () => {
      console.log(`${name} node started and listen ${port} port!`);
    });
  }

  groupByKey(maps) {
    return maps
      .reduce((acc,prev) => [...acc, ...prev],[])
      .reduce((acc,prev) => [...acc, ...prev],[])
      .reduce((acc,el) => {
        if (acc[el.key]) {
          acc[el.key].push(el.value);
        } else {
          acc[el.key] = [el.value];
        }
        return acc;
      }, {});
  }
}

class MapReduceClient {
  constructor({ masterPort }) {
    this.masterPort = masterPort;
  }

  map(fn) {
    this.mapper = fn;
    return this;
  }

  async reduce(fn, start) {
    if (!this.mapper) {
      throw new Error('Cannot reduce without map function!');
    }
    const response = await axios.post(`http://127.0.0.1:${this.masterPort}/map-reduce`, {
      mapper: this.mapper.toString(),
      reducer: {
        start,
        func: fn.toString(),
      }
    });
    return response.data;
  }
}

module.exports = {
  MapReduceSlave,
  MapReduceMaster,
  MapReduceClient,
}