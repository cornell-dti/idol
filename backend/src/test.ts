import axios from 'axios';
const request = require('request');
const fs = require('fs');

const download = (url, path, callback) => {
  request.head(url, (err, res, body) => {
    request(url).pipe(fs.createWriteStream(path)).on('close', callback);
  });
};

axios
  .get('http://localhost:9000/.netlify/functions/api/allMemberImages')
  .then((res) => {
    return res!.data;
  })
  .then((val) => {
    if (val.err) console.log(val.err);
    else {
      const images = val.images;
      images.forEach((image) => {
        console.log(image.url);
        download(image.url, `./${image.fileName}`, () =>
          console.log('WEIIIII')
        );
      });
    }
  })
  .catch((err) => console.log(err));
