import initGistSqlJs from "../src/gist-sqlite";

test("initGistSqlJs has the same usage as sql.js", async () => {
  // const initGistSqlJs = require("../src/gist-sqlite");

  const SQL = await initGistSqlJs({
    gh_token: process.env.GITHUB_TOKEN,
    gist_id: "4a9feacf49030cc50d85ec671057e388",
    filename: "gist-sqlite"
  });

  const db = new SQL.Database();

  const res = db.exec("PRAGMA table_info(test)");
  expect(res).toEqual([{
    columns: ['cid', 'name', 'type', 'notnull', 'dflt_value', 'pk'],
    values: [
      [0, 'id', 'INTEGER', 0, null, 1],
      [1, 'name', 'TEXT', 0, null, 0],
    ]
  }])
})
