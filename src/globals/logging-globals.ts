import debug from 'debug';
import { name } from '../../package.json';

export const LoggingLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  ERROR: 'error',
} as const;
export type LoggingLevel = (typeof LoggingLevel)[keyof typeof LoggingLevel];

export const infoLog = debug(`${name}:${LoggingLevel.INFO}`);
export const debugLog = debug(`${name}:${LoggingLevel.DEBUG}`);
export const errorLog = debug(`${name}:${LoggingLevel.ERROR}`);
