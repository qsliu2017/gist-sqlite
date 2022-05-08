# gist-sqlite

SQLite database purely running on browser and using GitHub Gist as storage.

## Usage
```javascript
const initGistSqlJs = require("gist-sqlite");

const SQL = await initGistSqlJs({
  gh_token: process.env.GITHUB_TOKEN,
  gist_id: process.env.GIST_ID,
  filename: "gist-sqlite",
  locateFile: file => `https://sql.js.org/dist/${file}`,
});

const db = new SQL.Database();

db.run("CREATE TABLE hello (a int, b char); \
INSERT INTO hello VALUES (0, 'hello'); \
INSERT INTO hello VALUES (1, 'world');");
```
