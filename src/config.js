const dev = {
  s3: {
    REGION: 'us-east-1',
    BUCKET: 'notes-app-2-api-dev-serverlessdeploymentbucket-k5zuz1xnqwhh',
  },
  apiGateway: {
    REGION: 'us-east-1',
    URL: 'https://2aw3qshpl5.execute-api.us-east-1.amazonaws.com/dev',
  },
  cognito: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_0rmrDpIEe',
    APP_CLIENT_ID: 'okdeksgm4vrheaa7767k172in',
    IDENTITY_POOL_ID: 'us-east-1:b2e43f7b-e2d8-4b53-a768-b08c6b27895b',
  },
};

const prod = {
  s3: {
    REGION: 'us-east-1',
    BUCKET: 'notes-app-2-api-prod-serverlessdeploymentbucket-1vn6fit4lfnsa',
  },
  apiGateway: {
    REGION: 'us-east-1',
    URL: 'https://be7e2l9ay3.execute-api.us-east-1.amazonaws.com/prod',
  },
  cognito: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_ldC5nVMMz',
    APP_CLIENT_ID: '7eqg9e32o6r0dhs46mkij151u0',
    IDENTITY_POOL_ID: 'us-east-1:b1620a17-cc7a-413e-817f-b40ebfb44fd2',
  },
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config,
};
