import express from 'express';

const rssList = new Set();

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
  router.get('/refresh', (req, res) => {
    res.send({ ok: true });
  });

  //* List
  router.get('/list', (req, res) => {
    res.send([...rssList]);
  });

  return router;
};
