/**
 * logger.ts
 * 
 * This file configures and manages multiple Winston loggers for specific logging streams used within the application.
 * The loggers are configured to send logs to AWS CloudWatch, organized by log stream. Each log stream is tailored 
 * to capture specific types of actions or information, such as client profile actions, account transactions, 
 * communication events, and audit logs.
 * 
 * Logging Streams:
 *   - `client-profile-management`: Tracks CRUD actions related to client profiles.
 *   - `communication-transactions`: Logs communication-related actions, such as email notifications.
 *   - `account-transactions`: Logs account creation and deletion events.
 *   - `identity-verification`: Logs identity verification procedures.
 *   - `audit-log`: Provides logs for auditing purposes, including sensitive data access and policy enforcement.
 *   - `system-errors`: Captures system errors, validation issues, and exceptions for troubleshooting.
 *   - `api-performance`: Logs metrics for API performance, such as request latency and response times.
 * 
 * Key Components:
 *   - `createLoggerForStream`: A helper function that creates and configures individual Winston loggers for each 
 *     log stream, with a CloudWatch transport to send logs to AWS CloudWatch.
 *   - `loggers`: An exported object containing all defined loggers, each associated with a unique stream.
 *   - `createLogEntry`: A helper function that formats log entries with consistent fields, including timestamp, 
 *     agent ID, client ID, action, and request-specific information.
 * 
 * Usage:
 *   Import the desired logger from `loggers` and call the `.info` or `.error` methods, passing a formatted log entry.
 *   Use `createLogEntry` to ensure log entries follow a consistent format.
 * 
 * Dependencies:
 *   - dotenv: Loads environment variables from a `.env` file for AWS credentials and CloudWatch configuration.
 *   - winston: Primary logging library for structured logging.
 *   - winston-cloudwatch: Integrates Winston with AWS CloudWatch.
 * 
 * Example Usage:
 *   ```
 *   loggers.clientProfile.info('Client profile created', createLogEntry({ action: 'CREATE_CLIENT_PROFILE', clientId, additionalData: { ... } }, req));
 *   ```
 * 
 * Author:
 *   0x11a0
 *   20241109
 */

import winston from 'winston';
import 'winston-cloudwatch';
import dotenv from 'dotenv';
import { Request } from 'express';

dotenv.config();

const createLoggerForStream = (logStreamName: string) => {
    return winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            new winston.transports.Console(),
            new (winston.transports as any).CloudWatch({
                logGroupName: process.env.CLOUDWATCH_LOG_GROUP_NAME || 'MyAppLogs',
                logStreamName, // Use the dynamic log stream name
                awsRegion: process.env.AWS_REGION,
                jsonMessage: true,
                awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
                awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                uploadRate: 1000, // Adjust for faster uploads in testing
            })
        ]
    });
};

// Export individual loggers for each log stream
export const loggers = {
    communication: createLoggerForStream('communication-transactions'),
    systemErrors: createLoggerForStream('system-errors'),
    auditLog: createLoggerForStream('audit-log'),
    accountTransactions: createLoggerForStream('account-transactions'),
    clientProfile: createLoggerForStream('client-profile-management'),
    identityVerification: createLoggerForStream('identity-verification'),
    apiPerformance: createLoggerForStream('api-performance'),
};

// Log entry helper
interface LogEntryOptions {
    action: string;
    clientId: string;
    additionalData?: object;
    status?: "SUCCESS" | "FAILURE";
}

export const createLogEntry = (options: LogEntryOptions, req: Request) => ({
    timestamp: new Date().toISOString(),
    agentId: req.agentId || 'UNKNOWN_AGENT',
    clientId: options.clientId,
    action: options.action,
    endpoint: req.originalUrl,
    status: options.status || "SUCCESS",
    requestIP: req.ip,
    userRole: "agent",
    ...options.additionalData,
});