import { ResourceGroup } from '@pulumi/azure/core';
import { Group } from '@pulumi/azure/containerservice';
import { Config, StackReference } from '@pulumi/pulumi';
import { Image } from '@pulumi/docker';
import { FlexibleDatabase } from '@pulumi/azure/mysql/flexibleDatabase';
import { FlexibleServer } from '@pulumi/azure/mysql';

const azureConfig = new Config('azure');
const config = new Config();

const location = azureConfig.require('location');
const prefix = config.require('prefix');

const ptbCoreInfraStack = new StackReference('organization/ptb-core-infra/dev');
const databaseServer = ptbCoreInfraStack
  .getOutput('databaseServer')
  .apply((server) => server as FlexibleServer);
const dbResourceGroupName = ptbCoreInfraStack
  .getOutput('resourceGroupName')
  .apply((name) => name as string);

// https://www.pulumi.com/registry/packages/azure/api-docs/core/resourcegroup/
const resourceGroup = new ResourceGroup(`${prefix}-resource-group`, {
  location,
});

const exampleFlexibleDatabase = new FlexibleDatabase(`${prefix}-db`, {
  name: prefix,
  resourceGroupName: dbResourceGroupName,
  serverName: databaseServer.name,
  charset: 'utf8',
  collation: 'utf8_unicode_ci',
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
    DS_USERNAME: databaseServer.administratorLogin as any,
    DS_PASSWORD: databaseServer.administratorPassword as any,
    DS_DATABASE: exampleFlexibleDatabase.name,
    DS_HOST: databaseServer.fqdn,
    DEBUG: 'tplt-node-server:*',
    PORT: `${config.require('nodePort')}`,
  },
};

// https://www.pulumi.com/registry/packages/azure/api-docs/containerservice/group/
const containerGroup = new Group(`${prefix}-group`, {
  containers: [nodeJsContainer],
  ipAddressType: 'Private',
  subnetIds: ptbCoreInfraStack.getOutput('privateSubnetId'),
  osType: 'Linux',
  resourceGroupName: resourceGroup.name,
  location: resourceGroup.location,
});

export const containerIP = containerGroup.ipAddress;
export const containerSubnets = containerGroup.subnetIds;
