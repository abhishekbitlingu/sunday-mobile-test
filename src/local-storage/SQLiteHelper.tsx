import {User} from '@/types/Types';
import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';

const USER_TABLE = 'User';
enablePromise(true);
export const getDBConnection = async () => {
  return openDatabase({name: 'user-data.db', location: 'default'});
};

export const createTable = async (db: SQLiteDatabase) => {
  // create table if not exists
  const query =
    'CREATE TABLE IF NOT EXISTS ' +
    USER_TABLE +
    ' (name VARCHAR(255) NOT NULL,' +
    'email VARCHAR(255) NOT NULL,' +
    'password VARCHAR(255) NOT NULL' +
    ')';
  await db.executeSql(query);
};

export const getAllUsers = async (db: SQLiteDatabase): Promise<User[]> => {
  try {
    const users: User[] = [];
    const results = await db.executeSql(
      'SELECT rowid as id,name,email,password FROM ' + USER_TABLE,
    );
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        users.push(result.rows.item(index));
      }
    });
    return users;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get users !!!');
  }
};

export const saveUser = async (db: SQLiteDatabase, user: User) => {
  const insertQuery =
    'INSERT INTO ' +
    USER_TABLE +
    " (name, email, password) VALUES ('" +
    user.name +
    "','" +
    user.email +
    "','" +
    user.password +
    "')";
  return db.executeSql(insertQuery);
};

export const getUser = async (db: SQLiteDatabase, email: string) => {
  const readQuery =
    'SELECT rowid as id,name,email,password FROM ' +
    USER_TABLE +
    " where email = '" +
    email +
    "'";
  return db.executeSql(readQuery);
};

export const deleteUser = async (db: SQLiteDatabase, email: string) => {
  const deleteQuery = 'DELETE from ' + USER_TABLE + ' where email = ' + email;
  await db.executeSql(deleteQuery);
};

export const deleteTable = async (db: SQLiteDatabase) => {
  const query = 'drop table ' + USER_TABLE;
  await db.executeSql(query);
};
