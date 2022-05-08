import { Octokit } from "octokit";
import initSqlJs, { Database, SqlJsConfig, SqlJsStatic } from "sql.js";

function GistDatabaseConstructor(
  sql: SqlJsStatic,
  update: (data: Uint8Array) => Promise<void>,
  data?: ArrayLike<number> | Buffer
): typeof Database {
  return class GistDatabase extends sql.Database {
    constructor() {
      super(data);
    }
    override async close() {
      update(this.export()).then(super.close);
    }
  }
}

async function initGistSqlJs(
  config:
    { gh_token: string, gist_id?: string, filename: string }
    & SqlJsConfig
): Promise<SqlJsStatic> {
  const { gh_token, gist_id, filename } = config;
  const SQL = await initSqlJs(config);
  const octokit = new Octokit({ auth: config.gh_token });

  let data: Uint8Array;
  if (gist_id) {
    const resp = await octokit.rest.gists.get({ gist_id });
    if (resp.status !== 200) {
      throw new Error(`Error getting gist, status: ${resp.status}`);
    }
    const content = resp.data.files[filename].content;
    data = Uint8Array.from(content.split(",").map(x => parseInt(x)));
  }

  const update: (data: Uint8Array) => Promise<void> = async (data) => {
    const content = data.join(",");

    if (gist_id) {
      await octokit.rest.gists.update({
        gist_id,
        files: { [filename]: { content } },
      });
    } else {
      await octokit.rest.gists.create({
        files: { [filename]: { content } },
        public: false,
      });
    }
  }

  return {
    Database: GistDatabaseConstructor(SQL, update, data),
    Statement: SQL.Statement
  };
}

export default initGistSqlJs;
