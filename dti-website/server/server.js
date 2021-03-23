const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, './../out')));

app.listen(3000, () => console.log('DTI Website is listening on PORT 3000'));
