import { SqlJsConfig, SqlJsStatic } from "sql.js";
declare function initGistSqlJs(config: {
    gh_token: string;
    gist_id?: string;
    filename: string;
} & SqlJsConfig): Promise<SqlJsStatic>;
export default initGistSqlJs;
