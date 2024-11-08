/**
 * express.d.ts
 * 
 * This file is a TypeScript declaration file that extends the default Express `Request` interface 
 * to include custom properties used across the application. By modifying the `Request` type, 
 * we can attach additional data to the `req` object, ensuring these custom properties are recognized 
 * throughout the codebase without TypeScript compilation errors.
 * 
 * Custom Properties:
 *   - `agentId`: (optional) A string representing the ID of the agent making the request. This property 
 *     is added to `req` in middleware and can be used for logging and tracking purposes.
 * 
 * Usage:
 *   Simply import this file into your project to enable `agentId` on `Request`. The `req.agentId` 
 *   property can then be accessed directly within any route handler or middleware function.
 * 
 * Example:
 *   ```
 *   app.use((req, res, next) => {
 *       req.agentId = 'AGENT12345';
 *       next();
 *   });
 *   
 *   // Access req.agentId in a route
 *   app.get('/example', (req, res) => {
 *       console.log(req.agentId); // Logs 'AGENT12345'
 *       res.send('Hello, World!');
 *   });
 *   ```
 * 
 * Export Statement:
 *   The `export {}` statement at the end ensures TypeScript treats this file as a module, which is 
 *   necessary for extending global types.
 * 
 * Author:
 *   0x11a0
 *   20241109
 */

import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            agentId?: string; // Optional property to store the agent's ID
        }
    }
}

export {}; // Ensures TypeScript treats this file as a module