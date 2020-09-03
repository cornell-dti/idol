import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../idol/build/')));


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../idol/build/', 'index.html'));
});

app.listen(port, () => {
  console.log("idol server listening on port " + port);
});