# Quick Setup Guide for Implementing Winston CloudWatch Logger in Your Microservice

## 1.	Install Required Packages:
Ensure that the following npm packages are installed in your microservice:

```bash
npm install winston winston-cloudwatch dotenv
npm install @types/winston --save-dev
```

## 2.	Create the .env file in the root directory of your microservice:

You’ll need to create a .env file with the required AWS CloudWatch configuration. Copy and modify the example below:

```
AWS_ACCESS_KEY_ID=<your IAM Access Id>
AWS_SECRET_ACCESS_KEY=<your IAM Access Key>
AWS_REGION=ap-southeast-1
CLOUDWATCH_LOG_GROUP_NAME=crm-system/agent-interactions
PORT=3000
```

Replace the placeholders (your-region, your-log-group-name, your-aws-access-key-id, your-aws-secret-access-key) with your actual values.

## 3.	Create logger.ts in your src directory:
This file will contain the logic for logging to different CloudWatch log streams based on the microservice’s actions. Below is a basic setup:

```javascript
import winston from 'winston';
import 'winston-cloudwatch';
import dotenv from 'dotenv';

dotenv.config();

const createLoggerForStream = (logStreamName: string) => {
    return winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            new winston.transports.Console(),
            new (winston.transports as any).CloudWatch({
                logGroupName: process.env.CLOUDWATCH_LOG_GROUP_NAME || 'MyAppLogs',
                logStreamName,
                awsRegion: process.env.AWS_REGION,
                jsonMessage: true,
                awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
                awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                uploadRate: 1000,
            })
        ]
    });
};

export const loggers = {
    communication: createLoggerForStream('communication-transactions'),
    systemErrors: createLoggerForStream('system-errors'),
    auditLog: createLoggerForStream('audit-log'),
    accountTransactions: createLoggerForStream('account-transactions'),
    clientProfile: createLoggerForStream('client-profile-management'),
    identityVerification: createLoggerForStream('identity-verification'),
    apiPerformance: createLoggerForStream('api-performance'),
};
```

## Create the file `src/express.d.ts` for Custom Request Types
This is only for Typescript apps that requires us to extend the `req` type.
```javascript
import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            agentId?: string;
        }
    }
}

export {};
```

## 5.	Implement the Middleware  in your app:
This is so that you inject the `agentId` extracted from the JWT token into the request parameter. Apply this middleware to every incoming request by placing this code at the top of your controller or in your `app.ts` or `index.ts`.
```javascript
app.use((req, res, next) => {
    req.agentId = 'AGENT12345'; // Change to extract from JWT
    next();
});
```

## 6. Implement the Logger in you app:
First import the logger into the file with the functions:
```javascript
import { loggers, createLogEntry } from './logger';
```

Refer to inline comments.
```javascript
// Example
app.get('/example', (req: Request, res: Response) => {
    // At the start of every function,
    // - must define startTime
    // - must extract clientId to be used for logger
    const startTime = Date.now();
    const clientId = 'CLIENT12345'; // Replace with actual client data

    // Example usage of the logger
    // to call other streams, simply:
    // change the variable after `loggers` to:
    // - communication
    // - systemErrors
    // - auditLog
    // - accountTransactions
    // - clientProfile
    // - identityVerification
    // - apiPerformance
    loggers.clientProfile.info('Client profile viewed', {
        action: 'VIEW',
        clientId,
        agentId: req.agentId,
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
        requestIP: req.ip,
    });

    // End of function must always:
    // - set endTime
    // log the performace of this function
    const endTime = Date.now();
    loggers.apiPerformance.info('API performance log', {
        endpoint: req.originalUrl,
        latency: `${endTime - startTime}ms`,
        status: res.statusCode,
        timestamp: new Date().toISOString(),
    });

    res.send('return response for example endpoint');
});

```

Voila!
