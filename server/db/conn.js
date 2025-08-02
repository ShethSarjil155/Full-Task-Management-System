const mongoos = require("mongoose");

const DB = "mongodb://localhost:27017/tasksdb";

// mongoos.set('strictQuery',true);
mongoos
  .connect(DB, {})
  .then(() => console.log("Database Connected "))
  .catch((err) => {
    console.log(err);
  });
