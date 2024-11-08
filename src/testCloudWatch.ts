/**
 * testCloudWatch.ts - AWS CloudWatch Logs Connection Test Script
 *
 * This script serves as a test to verify connectivity and credentials for AWS CloudWatch Logs.
 * It connects to CloudWatch Logs using AWS SDK credentials provided in the environment variables
 * and retrieves a list of available log groups. This test is useful for ensuring that AWS credentials 
 * are correctly configured and that the application has the necessary permissions.
 * 
 * Configuration:
 *   - The script loads AWS credentials and region from a `.env` file using the `dotenv` package.
 *   - Ensure the `.env` file includes:
 *     - `AWS_REGION`: AWS region (e.g., `us-east-1`).
 *     - `AWS_ACCESS_KEY_ID`: Access Key ID for AWS.
 *     - `AWS_SECRET_ACCESS_KEY`: Secret Access Key for AWS.
 * 
 * Usage:
 *   - Run this script with `ts-node` to test CloudWatch Logs connectivity.
 *   - This script should be used in development/testing environments only.
 * 
 * Prerequisites:
 *   - Ensure that `dotenv` and `aws-sdk` packages are installed.
 *   - Add appropriate permissions to the AWS user/role for accessing CloudWatch Logs.
 * 
 * Example:
 *   ```
 *   DEBUG=winston-cloudwatch ts-node testCloudWatch.ts
 *   ```
 * 
 * Example .env File:
 *   ```
 *   AWS_REGION=us-east-1
 *   AWS_ACCESS_KEY_ID=your-access-key-id
 *   AWS_SECRET_ACCESS_KEY=your-secret-access-key
 *   ```
 * 
 * Author:
 *   0x11a0
 *   20241109
 */

import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const cloudwatchlogs = new AWS.CloudWatchLogs({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

cloudwatchlogs.describeLogGroups({}, (err, data) => {
    if (err) {
        console.error("Error connecting to CloudWatch Logs:", err);
    } else {
        console.log("CloudWatch Logs available:", data);
    }
});