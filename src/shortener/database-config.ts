import * as dotenv from 'dotenv';
import entitiesRegister from './models.register';

dotenv.config();

const configDatabase: Object = process.env.DATABASE_URL
  ? {
      type: process.env.DATABASE_TYPE,
      url: process.env.DATABASE_URL,
      entities: entitiesRegister,
      synchronize: true
    }
  : {
      type: process.env.DATABASE_TYPE,
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: entitiesRegister,
      synchronize: true
    };

export default configDatabase;
