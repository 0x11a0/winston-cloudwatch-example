/**
 * app.ts
 * 
 * This file is the main application entry point for an Express.js server that integrates comprehensive logging for 
 * all application actions. It covers multiple logging streams, including client profile management, communication 
 * transactions, account transactions, identity verification, audit logs, system errors, and API performance metrics.
 * 
 * Logging is implemented with structured JSON format to enhance clarity and provide detailed, actionable logs for each 
 * interaction. The primary logging library is Winston, with AWS CloudWatch configured as the log destination. Log streams
 * include:
 *   - `client-profile-management`: Logs CRUD actions on client profiles.
 *   - `communication-transactions`: Logs all communication events (e.g., email notifications).
 *   - `account-transactions`: Logs account management actions (create, delete).
 *   - `identity-verification`: Logs identity verification processes for clients.
 *   - `audit-log`: Logs sensitive data access and policy enforcement for auditing purposes.
 *   - `system-errors`: Logs system errors, validation issues, and other exceptions.
 *   - `api-performance`: Logs API performance metrics to meet non-functional requirements (NFR).
 * 
 * Major Route Examples:
 *   - `/example`: Demonstrates logging across all streams.
 *   - `/api/clients`: Handles client profile creation, verification, update, viewing, and deletion.
 *   - `/api/accounts`: Manages account creation and deletion.
 *   - `/error`: Example route to demonstrate logging system errors.
 * 
 * Dependencies:
 *   - dotenv: Loads environment variables from a `.env` file.
 *   - express: Web framework for handling HTTP requests.
 *   - loggerMiddleware: Custom middleware to log requests at the middleware layer.
 *   - logger.ts: Custom logger utility with helper functions to log to specific streams in AWS CloudWatch.
 * 
 * Key Middleware:
 *   - `logRequest`: Logs all incoming requests with key details.
 *   - Middleware to add `agentId`, `requestIP`, and `startTime` to each request.
 * 
 * Usage:
 *   Start the server with the command:
 *   ```
 *   DEBUG=winston-cloudwatch ts-node src/app.ts
 *   ```
 *   Ensure AWS credentials and CloudWatch configurations are properly set in environment variables.
 * 
 * Author:
 *   0x11a0
 *   20241109
 */


import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { logRequest } from './middleware/loggerMiddleware';
import { loggers, createLogEntry } from './logger';

dotenv.config();

const app = express();
app.use(express.json());
app.use(logRequest); // Middleware to log every request

// Middleware to add agentId, requestIP, and startTime to requests
app.use((req, res, next) => {
    req.agentId = 'UNKNOWN_AGENT';
    next();
});


// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 
// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 
// ===== ===== ===== ===== ===== ===== /example to test all streams  ===== ===== ===== ===== ===== 
// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 
// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 

// Example Route Logging to All Streams
app.get('/example', (req: Request, res: Response) => {
    const startTime = Date.now();
    const agentId = 'AGENT12345'; // Simulate an agent ID, replace with dynamic value in real app
    const clientId = 'CLIENT67890'; // Simulate a client ID, replace with dynamic value in real app

    // 1. Client Profile Management Log
    loggers.clientProfile.info('Client profile viewed', {
        action: 'VIEW',
        clientId,
        agentId,
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
        requestIP: req.ip,
        userRole: 'agent',
        latency: `${Date.now() - startTime}ms`
    });

    // 2. Communication Transactions Log
    loggers.communication.info('Communication transaction', {
        action: 'SEND_EMAIL_NOTIFICATION',
        clientId,
        agentId,
        emailSubject: 'Account Verification',
        emailStatus: 'SENT',
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
        requestIP: req.ip
    });

    // 3. Account Transactions Log
    loggers.accountTransactions.info('Account action', {
        action: 'CREATE',
        clientId,
        accountId: `account-${Date.now()}`, // Example account ID
        agentId,
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
        requestIP: req.ip
    });

    // 4. Identity Verification Log
    loggers.identityVerification.info('Identity verification', {
        action: 'VERIFY',
        clientId,
        agentId,
        verificationStatus: 'APPROVED',
        verificationMethod: 'NRIC',
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
        requestIP: req.ip
    });

    // 5. Audit Log
    loggers.auditLog.info('Audit log entry', {
        action: 'ACCESS_RESOURCE',
        resource: 'Client Profile',
        clientId,
        agentId,
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
        requestIP: req.ip
    });

    // 6. System Errors Log (simulate an error)
    try {
        throw new Error('Simulated system error');
    } catch (error) {
        loggers.systemErrors.error('System error encountered', {
            action: 'ERROR',
            error: (error as Error).message,
            clientId,
            agentId,
            timestamp: new Date().toISOString(),
            status: 'FAILURE',
            requestIP: req.ip
        });
    }

    // 7. API Performance Log
    const endTime = Date.now();
    loggers.apiPerformance.info('API performance log', {
        endpoint: '/example',
        method: 'GET',
        agentId,
        status: res.statusCode,
        latency: `${endTime - startTime}ms`,
        timestamp: new Date().toISOString(),
        requestIP: req.ip
    });

    res.send('Example endpoint accessed, logs generated in all streams.');
});

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 
// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 
// ===== ===== ===== ===== ===== ===== /individual examples   =====  ===== ===== ===== ===== ===== 
// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 
// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 

// 1. Create Client Profile
app.post('/api/clients', (req: Request, res: Response) => {
    const startTime = Date.now(); // Start time variable for the request
    const clientData = req.body;
    const clientId = `client-${Date.now()}`;

    loggers.clientProfile.info('Client profile created', createLogEntry({
        action: 'CREATE_CLIENT_PROFILE',
        clientId,
        additionalData: { attributes: clientData }
    }, req));

    // Audit Log for client profile creation
    loggers.auditLog.info('Audit log for client profile creation', createLogEntry({
        action: 'AUDIT_CREATE_CLIENT_PROFILE',
        clientId,
        additionalData: { agentId: req.headers.agentId, clientData }
    }, req));

    const endTime = Date.now();
    const latency = endTime - startTime;

    // Log request processing time
    loggers.apiPerformance.info('Request processed', {
        endpoint: req.path,
        method: req.method,
        status: res.statusCode,
        latency: `${latency}ms`
    });

    res.status(201).send({ message: 'Client profile created', clientId });
});

// 2. Verify Client Identity
app.post('/api/clients/:clientId/verify', (req: Request, res: Response) => {
    const startTime = Date.now(); // Start time variable for the request
    const { clientId } = req.params;
    const verificationData = req.body;
    
    loggers.identityVerification.info('Initiating identity verification', createLogEntry({
        action: 'VERIFY_IDENTITY',
        clientId,
        additionalData: { verificationData }
    }, req));

    const isVerified = true; // Simulate verification outcome

    loggers.identityVerification.info('Identity verification result', createLogEntry({
        action: 'VERIFY_IDENTITY',
        clientId,
        additionalData: { status: isVerified ? 'VERIFIED' : 'FAILED' },
        status: isVerified ? 'SUCCESS' : 'FAILURE'
    }, req));

    // Audit Log for identity verification
    loggers.auditLog.info('Audit log for identity verification', createLogEntry({
        action: 'AUDIT_VERIFY_IDENTITY',
        clientId,
        additionalData: { agentId: req.headers.agentId, verificationStatus: isVerified ? 'VERIFIED' : 'FAILED' }
    }, req));

    const endTime = Date.now();
    const latency = endTime - startTime;

    // Log request processing time
    loggers.apiPerformance.info('Request processed', {
        endpoint: req.path,
        method: req.method,
        status: res.statusCode,
        latency: `${latency}ms`
    });

    res.send({ message: `Client ${isVerified ? 'verified' : 'not verified'}`, clientId });
});

// 3. Update Client Information
app.put('/api/clients/:clientId', (req: Request, res: Response) => {
    const startTime = Date.now(); // Start time variable for the request
    const { clientId } = req.params;
    const updatedData = req.body;

    loggers.clientProfile.info('Updating client profile', createLogEntry({
        action: 'UPDATE_CLIENT_PROFILE',
        clientId,
        additionalData: { updatedData }
    }, req));

    // Audit Log for updating client profile
    loggers.auditLog.info('Audit log for updating client profile', createLogEntry({
        action: 'AUDIT_UPDATE_CLIENT_PROFILE',
        clientId,
        additionalData: { agentId: req.headers.agentId, updatedData }
    }, req));

    const endTime = Date.now();
    const latency = endTime - startTime;

    // Log request processing time
    loggers.apiPerformance.info('Request processed', {
        endpoint: req.path,
        method: req.method,
        status: res.statusCode,
        latency: `${latency}ms`
    });

    res.send({ message: 'Client profile updated', clientId });
});

// 4. Get Client Profile
app.get('/api/clients/:clientId', (req: Request, res: Response) => {
    const startTime = Date.now(); // Start time variable for the request
    const { clientId } = req.params;

    loggers.clientProfile.info('Retrieving client profile', createLogEntry({
        action: 'VIEW_CLIENT_PROFILE',
        clientId,
        status: 'SUCCESS'
    }, req));

    // Audit Log for viewing client profile
    loggers.auditLog.info('Audit log for viewing client profile', createLogEntry({
        action: 'AUDIT_VIEW_CLIENT_PROFILE',
        clientId,
        additionalData: { agentId: req.headers.agentId }
    }, req));

    const clientData = { name: 'John Doe', id: clientId }; // Example data

    const endTime = Date.now();
    const latency = endTime - startTime;

    // Log request processing time
    loggers.apiPerformance.info('Request processed', {
        endpoint: req.path,
        method: req.method,
        status: res.statusCode,
        latency: `${latency}ms`
    });
    
    res.send(clientData);
});

// 5. Delete Client Profile
app.delete('/api/clients/:clientId', (req: Request, res: Response) => {
    const startTime = Date.now(); // Start time variable for the request
    const { clientId } = req.params;

    loggers.clientProfile.info('Deleting client profile', createLogEntry({
        action: 'DELETE_CLIENT_PROFILE',
        clientId,
        status: 'SUCCESS'
    }, req));

    // Audit Log for deleting client profile
    loggers.auditLog.info('Audit log for deleting client profile', createLogEntry({
        action: 'AUDIT_DELETE_CLIENT_PROFILE',
        clientId,
        additionalData: { agentId: req.headers.agentId }
    }, req));

    const endTime = Date.now();
    const latency = endTime - startTime;

    // Log request processing time
    loggers.apiPerformance.info('Request processed', {
        endpoint: req.path,
        method: req.method,
        status: res.statusCode,
        latency: `${latency}ms`
    });

    res.send({ message: 'Client profile deleted', clientId });
});

// 6. Create Account
app.post('/api/accounts', (req: Request, res: Response) => {
    const startTime = Date.now(); // Start time variable for the request
    const accountData = req.body;
    const accountId = `account-${Date.now()}`;

    loggers.accountTransactions.info('Account created', createLogEntry({
        action: 'CREATE_ACCOUNT',
        clientId: req.headers.agentId as string,
        additionalData: { accountId, details: accountData },
        status: 'SUCCESS'
    }, req));

    // Audit Log for account creation
    loggers.auditLog.info('Audit log for account creation', createLogEntry({
        action: 'AUDIT_CREATE_ACCOUNT',
        clientId: req.headers.agentId as string,
        additionalData: { accountId, accountData }
    }, req));

    const endTime = Date.now();
    const latency = endTime - startTime;

    // Log request processing time
    loggers.apiPerformance.info('Request processed', {
        endpoint: req.path,
        method: req.method,
        status: res.statusCode,
        latency: `${latency}ms`
    });

    res.status(201).send({ message: 'Account created', accountId });
});

// 7. Delete Account
app.delete('/api/accounts/:accountId', (req: Request, res: Response) => {
    const startTime = Date.now(); // Start time variable for the request
    const { accountId } = req.params;

    loggers.accountTransactions.info('Deleting account', createLogEntry({
        action: 'DELETE_ACCOUNT',
        clientId: req.headers.agentId as string,
        additionalData: { accountId },
        status: 'SUCCESS'
    }, req));

    // Audit Log for account deletion
    loggers.auditLog.info('Audit log for account deletion', createLogEntry({
        action: 'AUDIT_DELETE_ACCOUNT',
        clientId: req.headers.agentId as string,
        additionalData: { accountId }
    }, req));

    const endTime = Date.now();
    const latency = endTime - startTime;

    // Log request processing time
    loggers.apiPerformance.info('Request processed', {
        endpoint: req.path,
        method: req.method,
        status: res.statusCode,
        latency: `${latency}ms`
    });

    res.send({ message: 'Account deleted', accountId });
});

// Error handling example for logging errors
app.get('/error', (req: Request, res: Response) => {
    try {
        throw new Error('Simulated error for demonstration');
    } catch (error) {
        loggers.systemErrors.error('System error encountered', createLogEntry({
            action: 'ERROR_OCCURRENCE',
            clientId: req.headers.agentId as string,
            additionalData: { error: (error as Error).message },
            status: 'FAILURE'
        }, req));

        res.status(500).send('Internal Server Error');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    loggers.systemErrors.info('Server startup', createLogEntry({
        action: 'SERVER_START',
        clientId: 'SYSTEM',
        additionalData: { port: PORT },
        status: 'SUCCESS'
    }, {} as Request));
});