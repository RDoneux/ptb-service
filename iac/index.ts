import { ResourceGroup } from '@pulumi/azure/core';
import { Group } from '@pulumi/azure/containerservice';
import { Config } from '@pulumi/pulumi';
import { Image } from '@pulumi/docker';

const azureConfig = new Config('azure');
const config = new Config();

const location = azureConfig.require('location');
const prefix = config.require('prefix');

// https://www.pulumi.com/registry/packages/azure/api-docs/core/resourcegroup/
const resourceGroup = new ResourceGroup(`${prefix}-resource-group`, {
  location,
});

// https://www.pulumi.com/registry/packages/docker/api-docs/image/
const image = new Image(`${prefix}-image`, {
  build: {
    context: '../',
    dockerfile: '../Dockerfile',
  },
  imageName: 'docker.io/rdoneux/ptb-service:latest',
  skipPush: false,
});

const mysqlContainer = {
  name: `${prefix}-mysql`,
  image: 'mysql:latest',
  memory: 1,
  cpu: 1,
  ports: [
    {
      port: +config.require('mysqlPort'),
      protocol: 'TCP',
    },
  ],
  environmentVariables: {
    MYSQL_ROOT_PASSWORD: config.require('mysqlRootPassword'),
    MYSQL_DATABASE: config.require('mysqlDatabase'),
    MYSQL_USER: config.require('mysqlUser'),
    MYSQL_PASSWORD: config.require('mysqlPassword')
  },
};

const nodeJsContainer = {
  name: `${prefix}-nodejs`,
  image: image.imageName,
  memory: 1,
  cpu: 1,
  ports: [
    {
      port: +config.require('nodePort'),
      protocol: 'TCP',
    },
  ],
  environmentVariables: {
    DS_USERNAME: mysqlContainer.environmentVariables.MYSQL_USER,
    DS_PASSWORD: mysqlContainer.environmentVariables.MYSQL_PASSWORD,
    DS_DATABASE: mysqlContainer.environmentVariables.MYSQL_DATABASE,
    DS_PORT: `${mysqlContainer.ports[0].port}`,
    DS_HOST: 'localhost',
    DEBUG: 'tplt-node-server:*',
    PORT: `${config.require('nodePort')}`,
  },
};

// https://www.pulumi.com/registry/packages/azure/api-docs/containerservice/group/
const containerGroup = new Group(`${prefix}-group`, {
  containers: [
    mysqlContainer,
    nodeJsContainer,
  ],
  osType: 'Linux',
  resourceGroupName: resourceGroup.name,
  location: resourceGroup.location,
});

export const containerIP = containerGroup.ipAddress;
