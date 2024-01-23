const { MongoClient } = require('mongodb');
const state = { db: null };

const url = 'mongodb://localhost:27017';
const dbname = 'Project';

const connect = async () => {
  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    state.db = client.db(dbname);
    console.log('Connected to the database');
  } catch (err) {
    console.error('Error connecting to the database:', err);
    throw err; 
  }
};

const get = () => {
  if (!state.db) {
    console.error('Database not connected');
    return null;
  }
  return state.db;
};

module.exports = {
  connect,
  get,
};
