# Winston CloudWatch Example

## Overview

The **Winston CloudWatch Example** is a TypeScript-based application that demonstrates how to integrate the Winston logging library with AWS CloudWatch for logging application events. This example showcases structured logging for various microservice operations while ensuring that logs are sent to AWS CloudWatch for centralized monitoring and analysis.

## Features

- **Structured Logging**: Each log entry includes details such as timestamps, agent IDs, client IDs, and action types.
- **Multiple Log Streams**: Supports separate log streams for different functionalities (e.g., client profile management, communication transactions, etc.).
- **Middleware Logging**: Logs incoming requests with relevant details for monitoring API usage and performance.
- **Error Handling**: Logs system errors and other critical events to ensure proper tracking and alerting.

## Setup Guide

### Prerequisites

1. **Node.js**: Ensure you have Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).
2. **AWS Account**: You need an AWS account to access CloudWatch.
3. **CloudWatch**: Needs to be setup with log group and streams as specified in `src/logger.ts`. (You can also modify it with your own streams)

### Clone the Repository

```bash
git clone https://github.com/0x11a0/winston-cloudwatch-example.git
cd winston-cloudwatch-example
```

### Install Dependencies
```bash
npm install
```

### Configure Environment Variables

Create a .env file in the root of the project and configure the following environment variables:

```
AWS_REGION=your-aws-region
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
CLOUDWATCH_LOG_GROUP_NAME=your-log-group-name
PORT=3000
```

### Environment Variable Descriptions:

- AWS_REGION: The AWS region where your CloudWatch log group is located (e.g., us-east-1).

- AWS_ACCESS_KEY_ID: Your AWS Access Key ID.

- AWS_SECRET_ACCESS_KEY: Your AWS Secret Access Key.

- CLOUDWATCH_LOG_GROUP_NAME: The name of the CloudWatch log group where logs will be sent.

- PORT: The port on which the Express server will run (default is 3000).

### Run the Application

You can start the application using the following command:

```
DEBUG=winston-cloudwatch ts-node src/app.ts
```

This command will start the Express server and enable logging to CloudWatch.

### Testing the Logging Functionality

1.	Access the /example endpoint to generate log entries across all defined log streams. You can do this by navigating to http://localhost:3000/example in your browser or using a tool like Postman.

2.	The logs should appear in your specified CloudWatch log group and streams within a few moments.

## Structure

- src: Contains the source code of the application.

- app.ts: Main application file where routes and middleware are defined.

- logger.ts: Configures the Winston logger with CloudWatch transport.

- express.d.ts: Extends Express’s Request type to include custom properties.

- middleware: Contains middleware functions for logging requests.

- testCloudWatch.ts: A script to test the connection to CloudWatch.
