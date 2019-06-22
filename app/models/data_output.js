// We require the orm
var orm = require("../config/orm");

// We create a new object called dataOutput which we will use to read, create, update and select a single column from the database
var dataOutput = {
  // We read files from the database
  read: function(cb) {
    orm.read("data_output", function(res) {
      cb(res);
      console.log(res);
    });
  },
  // we read specific columns from the database
  selectColumn: function(cb) {
    orm.selectColumn("data_output", col, function(res) {
      cb(res);
    });
  },
  // We insert new data into the database
  create: function(cb) {
    orm.create("data_output", col, val, function(res) {
      cb(res);
    });
  },
  // We update certain values in the database
  update: function(cb) {
    orm.update("data_output", input, val, function(res) {
      res;
    });
  }
};
// create the orm file where we can render the info from the database

module.exports = dataOutput;
