import { NextFunction, Request, Response } from 'express';
import { debugLog } from '../globals/logging-globals';

export default function logger(request: Request, response: Response, next: NextFunction): void {
  debugLog({ url: request.url, query: request.query, body: request.body, params: request.params });
  next();
}
