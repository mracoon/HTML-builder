const fs = require('fs');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderPath, { withFileTypes: true }, (err, files) => {
  files.map(el => {
    if (el.isFile()) {
      const filePath = path.join(secretFolderPath, el.name);
      const fileName = el.name.split('.')[0];
      const fileExt = el.name.split('.')[1];
      let resultStr = fileName + ' - ' + fileExt + ' - ';
      fs.stat(filePath, (err, stats) => {
        resultStr += `${stats.size / 1024}kb`;
        console.log(resultStr);
      });
    }
  });
});