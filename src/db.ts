import mongoose from 'mongoose';
import { Logger } from './helpers/logger.helper';

const logger = new Logger('MONGODB');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/test');
mongoose.connection.once('open', () => logger.log('Connected'));
mongoose.connection.on('error', (error) => logger.error(error));
