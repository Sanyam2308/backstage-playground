import { CatalogClient } from '@backstage/catalog-client';
import { createBuiltinActions } from '@backstage/plugin-scaffolder-backend';
import { ScmIntegrations } from '@backstage/integration';
import { createRouter } from '@backstage/plugin-scaffolder-backend';
import { createHttpBackstageAction } from '@roadiehq/scaffolder-backend-module-http-request';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';
import { createCustomHttpBackstageAction } from '../actions/http-request-action/run/backstageRequest';
import { createUnzipFileAction } from '../actions/unzip-file/run';
import { createGitPullRequestAction } from '../actions/git/run/gitPullRequest';
import { createGitCommitPushAction, getGitRepoDetailsAction } from '../actions/git';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });
  const integrations = ScmIntegrations.fromConfig(env.config);
  const discovery = env.discovery;
  
  const builtInActions = createBuiltinActions({
    integrations,
    catalogClient,
    config: env.config,
    reader: env.reader,
  });

  const actions = [...builtInActions, 
    createHttpBackstageAction({ discovery }), 
    createCustomHttpBackstageAction({ discovery }),
    createUnzipFileAction(),
    createGitPullRequestAction(),
    createGitCommitPushAction(),
    getGitRepoDetailsAction()  ]; 

  return await createRouter({
    actions,
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    catalogClient,
    identity: env.identity,
    permissions: env.permissions,
  });
}
