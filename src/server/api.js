import express from 'express';
import Parser from 'rss-parser';

//Subscribed RSS Feeds
const rssList = new Set();

// RSS Parser
let parser = new Parser();

export default server => {
  const router = express.Router();

  //* Add
  router.post('/add', (req, res) => {
    const { url } = req.body;
    if (rssList.has(url)) {
      res.send({ added: false, rssList: [...rssList] });
      return;
    }
    rssList.add(url);
    res.send({ added: true, rssList: [...rssList] });
  });

  //* Delete
  router.post('/del', (req, res) => {
    const { url } = req.body;
    if (!rssList.has(url)) {
      res.send({ removed: false, rssList: [...rssList] });
      return;
    }
    rssList.delete(url);
    res.send({ removed: true, rssList: [...rssList] });
  });

  //* Refresh
  router.get('/refresh', async (req, res) => {
    try {
      const result = [];
      for (const url of rssList) {
        const feed = await parser.parseURL(url);
        result.push(feed);
      }
      res.send(result);
    } catch (e) {
      console.log('Exception', e);
    }
  });

  //* List
  router.get('/list', (req, res) => {
    res.send([...rssList]);
  });

  return router;
};
