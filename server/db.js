import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.log('Failed to set DNS servers in db.js:', e.message);
}

import { Product as MongoProduct } from './models/Product.js';
import { Brand as MongoBrand } from './models/Brand.js';
import { User as MongoUser } from './models/User.js';
import { Contact as MongoContact } from './models/Contact.js';
import { Order as MongoOrder } from './models/Order.js';
import { Testimonial as MongoTestimonial } from './models/Testimonial.js';
import { Settings as MongoSettings } from './models/Settings.js';

// Synchronously load environment variables before checking database config
const envPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env');
dotenv.config({ path: envPath });

const require = createRequire(import.meta.url);
let Database;
try {
  Database = require('better-sqlite3');
} catch (e) {
  // SQLite is optional, so we ignore loading errors here
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = process.env.VERCEL
  ? path.resolve('/tmp', 'lollyshop-data')
  : path.resolve(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'lollyshop.db');

let db;
let sqlEnabled = false;

let useMongo = !!process.env.MONGODB_URI;

const createDataDir = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    // In serverless environments, copy committed data files from the read-only source directory to /tmp
    if (process.env.VERCEL) {
      const srcDir = path.resolve(__dirname, 'data');
      if (fs.existsSync(srcDir)) {
        const files = fs.readdirSync(srcDir);
        for (const file of files) {
          const srcPath = path.join(srcDir, file);
          const destPath = path.join(DATA_DIR, file);
          if (fs.statSync(srcPath).isFile() && !fs.existsSync(destPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied seed file to serverless storage: ${file}`);
          }
        }
      }
    }
  } catch (err) {
    console.error('Error initializing serverless data directory:', err.message);
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

const seedSqliteFromJSON = () => {
  try {
    const tables = ['products', 'brands', 'users', 'contacts', 'orders', 'testimonials', 'settings'];
    for (const table of tables) {
      // Check if table is empty
      const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get().count;
      if (count === 0) {
        console.log(`SQLite table ${table} is empty. Migrating from JSON file...`);
        const jsonFile = path.join(DATA_DIR, `${table}.json`);
        if (fs.existsSync(jsonFile)) {
          const content = fs.readFileSync(jsonFile, 'utf-8');
          const data = JSON.parse(content);
          if (Array.isArray(data)) {
            const stmt = db.prepare(`INSERT INTO ${table} (id, data, createdAt, updatedAt) VALUES (?, ?, ?, ?)`);
            const now = new Date().toISOString();
            db.transaction(() => {
              for (const item of data) {
                const id = item.id || (table === 'settings' ? item.key : null);
                if (id) {
                  stmt.run(
                    id,
                    JSON.stringify(item),
                    item.createdAt || now,
                    item.updatedAt || now
                  );
                }
              }
            })();
            console.log(`Successfully migrated ${data.length} records to SQLite table ${table}.`);
          } else if (data && typeof data === 'object') {
            // For settings, it might be an object instead of array
            if (table === 'settings') {
              const now = new Date().toISOString();
              const stmt = db.prepare(`INSERT INTO settings (key, data, updatedAt) VALUES (?, ?, ?)`);
              db.transaction(() => {
                if (data.key || data.marqueeText) {
                  const key = data.key || 'main_settings';
                  stmt.run(key, JSON.stringify({ key, ...data }), now);
                } else {
                  for (const [key, val] of Object.entries(data)) {
                    stmt.run(key, JSON.stringify(val), now);
                  }
                }
              })();
              console.log(`Successfully migrated settings to SQLite settings table.`);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Error seeding SQLite from JSON files:', err.message);
  }
};

export const ensureDatabase = () => {
  if (useMongo) return; // Skip SQLite database setup if using MongoDB
  if (db) return;
  try {
    createDataDir();
    if (!Database) {
      db = null;
      sqlEnabled = false;
      return;
    }
    db = new Database(DB_PATH);
    initTables();
    sqlEnabled = true;
    console.log('SQLite database initialized at', DB_PATH);
    
    // Seed SQLite tables from JSON files if they are empty
    seedSqliteFromJSON();
  } catch (err) {
    console.error('Failed to initialize SQLite database:', err.message);
    db = null;
    sqlEnabled = false;
  }
};

if (useMongo) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Successfully connected to MongoDB Atlas database.'))
    .catch((err) => {
      console.error('Failed to connect to MongoDB Atlas database:', err.message);
      console.log('Falling back to SQLite database...');
      useMongo = false;
      ensureDatabase();
    });
} else {
  ensureDatabase();
}

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

const SqlProduct = makeModelClass('products');
const SqlBrand = makeModelClass('brands');
const SqlUser = makeModelClass('users');
const SqlContact = makeModelClass('contacts');
const SqlOrder = makeModelClass('orders');
const SqlTestimonial = makeModelClass('testimonials');
const SqlSettings = makeModelClass('settings', 'key');

const getActiveModel = (mongoModel, sqlModel) => {
  return (useMongo && mongoose.connection.readyState === 1) ? mongoModel : sqlModel;
};

const makeDynamicModel = (mongoModel, sqlModel) => {
  return new Proxy(class {}, {
    get(target, prop, receiver) {
      const activeModel = getActiveModel(mongoModel, sqlModel);
      const value = Reflect.get(activeModel, prop);
      if (typeof value === 'function') {
        return value.bind(activeModel);
      }
      return value;
    },
    construct(target, args, newTarget) {
      const activeModel = getActiveModel(mongoModel, sqlModel);
      return Reflect.construct(activeModel, args);
    }
  });
};

export const Product = makeDynamicModel(MongoProduct, SqlProduct);
export const Brand = makeDynamicModel(MongoBrand, SqlBrand);
export const User = makeDynamicModel(MongoUser, SqlUser);
export const Contact = makeDynamicModel(MongoContact, SqlContact);
export const Order = makeDynamicModel(MongoOrder, SqlOrder);
export const Testimonial = makeDynamicModel(MongoTestimonial, SqlTestimonial);
export const Settings = makeDynamicModel(MongoSettings, SqlSettings);

export const getUsersByEmail = async (email) => {
  if (useMongo && mongoose.connection.readyState === 1) {
    const normalized = String(email || '').trim().toLowerCase();
    return MongoUser.find({ email: { $regex: new RegExp(`^${normalized}$`, 'i') } });
  }
  if (!db) return [];
  const normalized = String(email || '').trim().toLowerCase();
  return getAllRows('users').filter((user) => String(user.email || '').trim().toLowerCase() === normalized);
};

export const findUserByEmail = async (email) => {
  if (useMongo && mongoose.connection.readyState === 1) {
    const normalized = String(email || '').trim().toLowerCase();
    return MongoUser.findOne({ email: { $regex: new RegExp(`^${normalized}$`, 'i') } });
  }
  if (!db) return null;
  return getUsersByEmail(email)[0] || null;
};

export const findUserByResetToken = async (token) => {
  if (useMongo && mongoose.connection.readyState === 1) {
    return MongoUser.findOne({ resetPasswordToken: token });
  }
  if (!db) return null;
  return getAllRows('users').find((user) => user.resetPasswordToken === token) || null;
};

export const sqlReady = () => {
  if (useMongo) {
    return mongoose.connection.readyState === 1;
  }
  return sqlEnabled;
};
