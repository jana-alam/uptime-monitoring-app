// dependencies
const fs = require("fs");
const path = require("path");
const { isRegExp } = require("util/types");

const lib = {};

// base directory of the data folder
lib.dirname = path.join(__dirname, "/../.data/");

// write data to the file

lib.create = (dir, file, data, callback) => {
  // open the file
  fs.open(`${lib.dirname + dir}/${file}.json`, "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // convert the data into json
      const stringData = JSON.stringify(data);
      // write data in the file
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (!err) {
          // close the file
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback("err");
            }
          });
        } else {
          callback(err);
        }
      });
    } else {
      callback("file could not open");
    }
  });
};

// read data
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.dirname + dir}/${file}.json`, "utf8", (err, data) => {
    callback(err, data);
  });
};
// update data
lib.update = (dir, file, data, callback) => {
  // open the file to write
  fs.open(`${lib.dirname + dir}/${file}.json`, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // truncate the file
      fs.ftruncate(fileDescriptor, (err) => {
        if (!err) {
          // convert the data into json string
          const stringData = JSON.stringify(data);
          // write the file
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
              // close the file
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callback(false);
                } else {
                  callback("error in closing th file");
                }
              });
            } else {
              callback("couldnt write in the file");
            }
          });
        } else {
          callback("error in delelting file content");
        }
      });
    } else {
      callback("error in opening the file");
    }
  });
};
// delete file
lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.dirname + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("Not able to delete");
    }
  });
};
module.exports = lib;
