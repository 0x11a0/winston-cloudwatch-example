/**
 * loggerMiddleware.ts - Middleware for Logging Incoming HTTP Requests
 *
 * This middleware intercepts incoming HTTP requests to log important request information, providing
 * an audit trail and helping with debugging and monitoring. Each incoming request's details, 
 * such as the HTTP method, URL, headers, parameters, and body, are logged to the `systemErrors` stream
 * in CloudWatch using Winston logger.
 *
 * The logs can be used to monitor API usage, diagnose issues, and maintain a record of request activity.
 * Ensure that sensitive information is filtered or masked as required by compliance policies.
 *
 * Configuration:
 *   - This middleware relies on `loggers` from `logger.ts`, which is configured with Winston and CloudWatch.
 *
 * Usage:
 *   - Apply this middleware globally to log all incoming requests or selectively to specific routes.
 * 
 * Example:
 *   ```
 *   import { logRequest } from './middleware/loggerMiddleware';
 *   app.use(logRequest); // Applies middleware globally
 *   ```
 *
 * Author:
 *   0x11a0
 *   20241109
 */

import { Request, Response, NextFunction } from 'express';
import { loggers } from '../logger';

export const logRequest = (req: Request, res: Response, next: NextFunction): void => {
    loggers.systemErrors.info({
        message: 'Incoming request',
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        params: req.params,
        body: req.body
    });
    next();
};