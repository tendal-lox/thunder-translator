import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { Admin } from './src/entities/admin.entity';
import { Files } from 'src/entities/files.entity';

const config: MysqlConnectionOptions = {
  type: 'mysql',
  database: 'auth_sample1',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'mysql',
  entities: [Admin, Files],
  synchronize: true,
  logging: false,
};

export default config;