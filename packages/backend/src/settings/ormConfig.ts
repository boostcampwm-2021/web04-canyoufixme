/* eslint-disable prettier/prettier */
import { ConnectionOptions } from 'typeorm';

import { User } from '../model/User';
import { Problem } from '../model/Problem';
import { SubmitLog } from '../model/SubmitLog';

const ormConfig: ConnectionOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, Problem, SubmitLog],
};
export default ormConfig;
