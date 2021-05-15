const MongoClient = require('mongodb').MongoClient; 
const mongoose = require('mongoose');

var p_db;
MongoPool=()=>{};

const mongoOption = {
  db: {
    numberOfRetries: 5
  },
  server: {
    auto_reconnect: true,
    poolSize: 5,
    socketOptions: {
      connectTimeoutMS: 500
    }
  },
  replSet: {},
  mongos: {}
};

const mongooseOption = {useNewUrlParser: true, useUnifiedTopology: true};

initMongoose = async() => {
  await mongoose.connect(process.env.MY_DB_URL, mongooseOption);
  console.log("Mongoose db connected");
}

// initializing pool
initPool = (cb) => {
  MongoClient.connect(process.env.MY_DB_URL, {},(err, db) => {
    if (err) throw err;
    p_db = db;
    if (cb && typeof(cb) == 'function')cb(p_db);
    else process.exit(1);
  });
  return MongoPool;
}

// get mongo db instances
getInstance = (cb) => {
  if (!p_db) {
    initPool(cb)
  } else {
    if (cb && typeof(cb) == 'function') cb(p_db);
    else process.exit(1);
  }
}

MongoPool.initMongoose = initMongoose;
MongoPool.getInstance = getInstance;
MongoPool.initPool = initPool;
module.exports = MongoPool;
