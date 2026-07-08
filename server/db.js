import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = process.env.VERCEL
  ? path.resolve('/tmp', 'lollyshop-data')
  : path.resolve(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'lollyshop.db');

let db;
let sqlEnabled = false;

const createDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

const safeJsonParse = (value, fallback = null) => {
  try {
    return JSON.parse(value);
  } catch (err) {
    return fallback;
  }
};

const parseRow = (row) => {
  if (!row) return null;
  return safeJsonParse(row.data, null);
};

const initTables = () => {
  db.prepare(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )`).run();

  db.prepare(`CREATE TABLE IF NOT EXISTS brands (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )`).run();

  db.prepare(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )`).run();

  db.prepare(`CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )`).run();

  db.prepare(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )`).run();

  db.prepare(`CREATE TABLE IF NOT EXISTS testimonials (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )`).run();

  db.prepare(`CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )`).run();
};

const generateId = (prefix) => {
  const safePrefix = String(prefix || 'x').charAt(0).toLowerCase();
  return `${safePrefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
};

export const ensureDatabase = () => {
  if (db) return;
  try {
    createDataDir();
    db = new Database(DB_PATH);
    initTables();
    sqlEnabled = true;
    console.log('SQLite database initialized at', DB_PATH);
  } catch (err) {
    console.error('Failed to initialize SQLite database:', err.message);
    db = null;
    sqlEnabled = false;
  }
};

const matchesQuery = (row, query) => {
  if (!query || typeof query !== 'object') return false;

  const compare = (value, expected) => {
    if (expected && typeof expected === 'object' && expected.$regex) {
      const regex = expected.$regex instanceof RegExp ? expected.$regex : new RegExp(expected.$regex, expected.$options || 'i');
      return regex.test(String(value || ''));
    }
    if (expected && typeof expected === 'object' && !Array.isArray(expected)) {
      if (typeof value !== 'object' || value === null) return false;
      return Object.keys(expected).every((key) => compare(value[key], expected[key]));
    }
    return value === expected;
  };

  return Object.keys(query).every((key) => compare(row[key], query[key]));
};

class Query extends Array {
  sort(spec) {
    if (spec && typeof spec === 'object' && spec.createdAt !== undefined) {
      const sorted = [...this].sort((a, b) => {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();
        return spec.createdAt === -1 ? bDate - aDate : aDate - bDate;
      });
      return new Query(...sorted);
    }
    return new Query(...super.sort(spec));
  }

  limit(count) {
    return new Query(...this.slice(0, count));
  }

  lean() {
    return this;
  }
}

const rowQuery = (table, whereClause = '', params = []) => {
  const stmt = db.prepare(`SELECT data FROM ${table} ${whereClause}`);
  return stmt.all(params).map(parseRow);
};

export const getAllRows = (table) => {
  if (!db) return [];
  return rowQuery(table, 'ORDER BY createdAt DESC');
};

export const getRowById = (table, id) => {
  if (!db) return null;
  const stmt = db.prepare(`SELECT data FROM ${table} WHERE id = ?`);
  return parseRow(stmt.get(id));
};

export const findRow = (table, query) => {
  if (!db) return null;
  return getAllRows(table).find((row) => matchesQuery(row, query)) || null;
};

export const filterRows = (table, query) => {
  if (!db) return [];
  return getAllRows(table).filter((row) => matchesQuery(row, query));
};

export const insertRow = (table, data) => {
  if (!db) return null;
  const now = new Date().toISOString();
  const row = {
    ...data,
    id: data.id || generateId(table),
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  };
  const stmt = db.prepare(`INSERT INTO ${table} (id, data, createdAt, updatedAt) VALUES (?, ?, ?, ?)`);
  stmt.run(row.id, JSON.stringify(row), row.createdAt, row.updatedAt);
  return row;
};

export const updateRow = (table, id, partialData) => {
  if (!db) return null;
  const existing = getRowById(table, id);
  if (!existing) return null;
  const now = new Date().toISOString();
  const row = {
    ...existing,
    ...partialData,
    id,
    createdAt: existing.createdAt || now,
    updatedAt: now
  };
  const stmt = db.prepare(`UPDATE ${table} SET data = ?, updatedAt = ? WHERE id = ?`);
  stmt.run(JSON.stringify(row), row.updatedAt, id);
  return row;
};

export const deleteRow = (table, id) => {
  if (!db) return false;
  const stmt = db.prepare(`DELETE FROM ${table} WHERE id = ?`);
  const result = stmt.run(id);
  return result.changes > 0;
};

export const getSetting = (key) => {
  if (!db) return null;
  const stmt = db.prepare('SELECT data FROM settings WHERE key = ?');
  return parseRow(stmt.get(key));
};

export const upsertSetting = (key, data) => {
  if (!db) return null;
  const now = new Date().toISOString();
  const existing = getSetting(key);
  const row = {
    key,
    ...data,
    updatedAt: now
  };
  if (existing) {
    const stmt = db.prepare('UPDATE settings SET data = ?, updatedAt = ? WHERE key = ?');
    stmt.run(JSON.stringify(row), now, key);
  } else {
    const stmt = db.prepare('INSERT INTO settings (key, data, updatedAt) VALUES (?, ?, ?)');
    stmt.run(key, JSON.stringify(row), now);
  }
  return row;
};

const makeModelClass = (table, primaryKey = 'id') => {
  return class {
    constructor(data = {}) {
      this.__table = table;
      Object.assign(this, data);
    }

    save() {
      if (this.id && getRowById(this.__table, this.id)) {
        const written = updateRow(this.__table, this.id, this);
        Object.assign(this, written);
        return this;
      }
      const written = insertRow(this.__table, this);
      Object.assign(this, written);
      return this;
    }

    static find(query = {}) {
      const rows = query && Object.keys(query).length ? filterRows(table, query) : getAllRows(table);
      return new Query(...rows);
    }

    static findById(id) {
      const row = getRowById(table, id);
      return row ? new this(row) : null;
    }

    static findOne(query) {
      const row = findRow(table, query);
      return row ? new this(row) : null;
    }

    static findOneAndUpdate(query, update, options = {}) {
      const row = findRow(table, query);
      if (row) {
        const updated = updateRow(table, row.id, { ...row, ...update });
        return options.new ? new this(updated) : new this(row);
      }
      if (options.upsert) {
        const inserted = insertRow(table, { ...query, ...update });
        return new this(inserted);
      }
      return null;
    }

    static findByIdAndUpdate(id, update, options = {}) {
      const row = getRowById(table, id);
      if (!row) return null;
      const updated = updateRow(table, id, { ...row, ...update });
      return options.new ? new this(updated) : new this(row);
    }

    static findByIdAndDelete(id) {
      const row = getRowById(table, id);
      if (!row) return null;
      deleteRow(table, id);
      return new this(row);
    }

    static countDocuments() {
      return getAllRows(table).length;
    }

    static insertMany(items) {
      return items.map((item) => new this(insertRow(table, item)));
    }

    static deleteMany(query = {}) {
      const rows = query && Object.keys(query).length ? filterRows(table, query) : getAllRows(table);
      rows.forEach((row) => deleteRow(table, row.id));
      return rows.length;
    }
  };
};

export const Product = makeModelClass('products');
export const Brand = makeModelClass('brands');
export const User = makeModelClass('users');
export const Contact = makeModelClass('contacts');
export const Order = makeModelClass('orders');
export const Testimonial = makeModelClass('testimonials');
export const Settings = makeModelClass('settings', 'key');

export const getUsersByEmail = (email) => {
  if (!db) return [];
  const normalized = String(email || '').trim().toLowerCase();
  return getAllRows('users').filter((user) => String(user.email || '').trim().toLowerCase() === normalized);
};

export const findUserByEmail = (email) => {
  if (!db) return null;
  return getUsersByEmail(email)[0] || null;
};

export const findUserByResetToken = (token) => {
  if (!db) return null;
  return getAllRows('users').find((user) => user.resetPasswordToken === token) || null;
};

export const sqlReady = () => sqlEnabled;
