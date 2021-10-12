const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./test.db");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get(
  '/test/get'
  , (req, res) => {
    db.serialize(() => {
      db.all(
        'select id, name from test;'
        , (error, rows) => {
          if (error) {
            console.log('エラー');
            console.log(error);
          }
          res.status(200).json(rows);
        }
      )
    });
    db.close();
  }
);

app.post(
  '/test/post'
  , (req, res) => {
    db.serialize(() => {
      db.all(
        'select id from test order by id desc limit 1;'
        , (error, rows) => {
          if (error) {
            console.log('エラー');
            console.log(error);
          }
          var id = rows[0] + 1;
          var statement = db.prepare('insert into test (id, name) values (?, ?);');
          statement.run(id, (req.body['name']) ? req.body['name'] : 'dummy');
          statement.finalize();
          res.status(200).send();
        }
      )
    });
    db.close();
  }
)

app.listen(3000, () => console.log('Start.'));
