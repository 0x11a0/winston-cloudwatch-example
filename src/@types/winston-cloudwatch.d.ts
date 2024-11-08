/**
 * @types/winston-cloudwatch.d.ts - TypeScript Type Definitions for Winston CloudWatch Integration
 *
 * This type definition file provides support for using Winston's CloudWatch transport
 * in a TypeScript environment, extending Winston's `Transports` interface to recognize 
 * the CloudWatch transport as a valid transport type.
 *
 * By declaring a `CloudWatch` property in the `Transports` interface, TypeScript will 
 * understand that Winston can use CloudWatch as a transport target for log data.
 *
 * Usage:
 *   - This file ensures that TypeScript does not throw type errors when using the CloudWatch 
 *     transport with Winston.
 *
 * Author:
 *   0x11a0
 *   20241109
 */

import * as TransportStream from 'winston-transport';

declare module 'winston' {
    interface Transports {
        CloudWatch: typeof TransportStream;
    }
}