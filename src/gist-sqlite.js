"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const octokit_1 = require("octokit");
const sql_js_1 = __importDefault(require("sql.js"));
function GistDatabaseConstructor(sql, update, data) {
    return class GistDatabase extends sql.Database {
        constructor() {
            super(data);
        }
        close() {
            const _super = Object.create(null, {
                close: { get: () => super.close }
            });
            return __awaiter(this, void 0, void 0, function* () {
                update(this.export()).then(_super.close);
            });
        }
    };
}
function initGistSqlJs(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const { gh_token, gist_id, filename } = config;
        const SQL = yield (0, sql_js_1.default)(config);
        const octokit = new octokit_1.Octokit({ auth: config.gh_token });
        let data = new Uint8Array();
        if (gist_id) {
            const resp = yield octokit.rest.gists.get({ gist_id });
            if (resp.status !== 200) {
                throw new Error(`Error getting gist, status: ${resp.status}`);
            }
            data = Uint8Array.from(resp.data.files[filename]
                .content.split(",").map(x => parseInt(x)));
        }
        const update = (data) => __awaiter(this, void 0, void 0, function* () {
            const content = data.join(",");
            if (gist_id) {
                yield octokit.rest.gists.update({
                    gist_id,
                    files: { [filename]: { content } },
                });
            }
            else {
                yield octokit.rest.gists.create({
                    files: { [filename]: { content } },
                    public: false,
                });
            }
        });
        return {
            Database: GistDatabaseConstructor(SQL, update, data),
            Statement: SQL.Statement
        };
    });
}
exports.default = initGistSqlJs;
