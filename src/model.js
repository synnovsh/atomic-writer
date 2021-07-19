const Database = require('better-sqlite3');
const path = require('path');
const electron = require('electron');

// read: https://www.sqlite.org/datatype3.html
// YYYY-MM-DD HH:MM:SS
const schema = `CREATE TABLE IF NOT EXISTS Entry(
    date DATE NOT NULL PRIMARY KEY,
    edited DATETIME NOT NULL,
    content TEXT
  );`;

const insertStr = `INSERT INTO entry (date, edited, content) 
    VALUES (date('now'), datetime('now'), ?)`;
const getStr = 'SELECT * FROM entry WHERE date = ? LIMIT 1';
const allByDateStr = 'SELECT * FROM entry ORDER BY date(date) DESC';
const updateStr = `UPDATE entry
  SET content = ? ,
      edited = datetime('now')
  WHERE
      date = ?`;

const testStr = `INSERT INTO entry (date, edited, content) 
    VALUES (?, ?, ?)`;

class Model {
  constructor() {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    this.path = path.join(userDataPath, 'atomicjournal.db');
    this.db = new Database(this.path);
    this.db.exec(schema);
    this.newEntryStmt = this.db.prepare(insertStr);
    this.getEntryStmt = this.db.prepare(getStr);
    this.getAllStmt = this.db.prepare(allByDateStr);
    this.updateStmt = this.db.prepare(updateStr);

    //this.testStmt = this.db.prepare(testStr);
    //this.addTestData();
  }

  addTestData() {
    this.db.exec('DROP TABLE IF EXISTS Entry');
    this.db.exec(schema);
    this.testStmt.run('2021-07-18', '2021-07-18 11:11:11', 'test1');
    this.testStmt.run('2021-07-17', '2021-07-17 12:12:12', 'test2');
    this.testStmt.run('2021-07-16', '2021-07-16 13:13:13', 'test3');
  }

  addEntry(content) {
    try {
      const addRes = this.newEntryStmt.run(content);
      if (addRes.changes !== 1) {
        console.log('no changes made');
      }
    } catch (err) {
      console.log(`Error adding entry to database: ${err}`);
    }
  }

  // Returns undefined or entry as obj
  getEntry(date) {
    let res = null;
    try {
      res = this.getEntryStmt.get(date);
    } catch (err) {
      console.log(`Error getting entry from database: ${err}`);
    }
    return res;
  }

  getAllEntries() {
    let res = null;
    try {
      res = this.getAllStmt.all();
    } catch (err) {
      console.log(`Error getting all entry from database: ${err}`);
    }
    return res;
  }

  updateEntry(date, content) {
    try {
      const updateRes = this.updateStmt.run(content, date);
      if (updateRes.changes !== 1) {
        console.log('No updates made');
      }
    } catch (err) {
      console.log(`Error updating entry in database: ${err}`);
    }
  }

  close() {
    this.db.close();
  }
}

module.exports = Model;
