import fs from "fs";
import sqlite3 from "sqlite3";
const filepath = "./ipns.db";

function createDbConnection() {
    if (fs.existsSync(filepath)) {
        return new sqlite3.Database(filepath);
    } else {
        const db = new sqlite3.Database(filepath, (error) => {
            if (error) {
                return console.error(error.message);
            }
            createTable(db);
        });
        console.log("Connection with SQLite has been established");
        return db;
    }
}

function createTable(db) {
    db.exec(`
  CREATE TABLE IF NOT EXISTS records
  (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    key BLOB NOT NULL,
    name TEXT NOT NULL,
    last_revision BLOB NOT NULL,
    minter TEXT NOT NULL,
    token_id TEXT
  );
`);
}

const db = createDbConnection()

export async function createRecord(
    name,
    minter,
    key,
    revision,
) {
    return new Promise((resolve, reject) => {
        db.run(
            'insert into records (name, minter, key, last_revision) VALUES (?, ?, ?, ?)',
            [name, minter, key, revision],
            (err => {
                if (err) reject(err)
                else resolve()
            })
        )
    })
}

export async function getRecordForToken(
    tokenId
) {
    return new Promise((resolve, reject) => {
        db.get(
            'select * from records where token_id = ? limit 1', [tokenId],
            ((err, row) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(row)
                }
            })
        )
    })
}

export async function updateRevisionFor(
    tokenId,
    revision
) {
    return new Promise((resolve, reject) => {
        db.run('update records set last_revision = ? where token_id = ?', [revision, tokenId], ((err) => {
            if (err) reject(err)
            else resolve()
        }))
    })
}

export async function updateTokenIdFor(
    tokenId,
    minter
) {
    return new Promise((resolve, reject) => {
        db.run('update records set token_id = ? where minter = ? AND token_id = null', [tokenId, minter], ((err) => {
            if (err) reject(err)
            else resolve()
        }))
    })
}