# AmplifyJS Custom Deployment
The `aws-amplify` javascript package is constantly being updated. Given that our custom features might never make it into the library, we will need to periodically update the core code, and adjust our changes accordingly. To seamlessly install, we have a Private NPM (with Verdaccio) hosted at AWS. This document describes the steps needed to publish our custom version of the `aws-amplify` library. In summary, whenever a new version is released, we need to rebase our code, adjust if necessary, build, update the version, and finally publish.

## 1. Rebase
Rebase `customDataSyncObservable` into latest `main` branch. Cherry-picking seems to be the best alternative. Be very careful. Study the actual changes and don't miss anything.

## 2. Custom Version
Rename affected package versions, from `M.m.p` to `M.m.p-customDataSyncObservable`
   - packages/amplify-ui-components/package.json
   - packages/amplify-ui-react/package.json
   - packages/amplify-ui/package.json
   - packages/analytics/package.json
   - packages/api-graphql/package.json
   - packages/api-rest/package.json
   - packages/api/package.json
   - packages/auth/package.json
   - packages/aws-amplify/package.json
   - packages/cache/package.json
   - packages/core/package.json
   - packages/core/src/Platform/version.ts
   - packages/datastore/package.json
   - packages/interactions/package.json
   - packages/predictions/package.json
   - packages/pubsub/package.json
   - packages/storage/package.json
   - packages/xr/package.json

Make sure interdependencies are also updated. For example, **XR** depends on **Core**, therefore it must point to the correct **Core** version `M.m.p-customDataSyncObservable`.

## 3. Build
```bash
yarn build --scope amazon-cognito-identity-js
yarn build --scope @aws-amplify/core
yarn build --scope @aws-amplify/cache
yarn build --scope @aws-amplify/pubsub
yarn build --scope @aws-amplify/api-rest
yarn build --scope @aws-amplify/api-graphql
yarn build --scope @aws-amplify/api
yarn build --scope @aws-amplify/auth
yarn build --scope @aws-amplify/datastore
yarn build --scope @aws-amplify/analytics
yarn build --scope @aws-amplify/ui-components
yarn build --scope @aws-amplify/ui-react
yarn build --scope @aws-amplify/ui
yarn build --scope @aws-amplify/xr
yarn build --scope @aws-amplify/interactions
yarn build --scope @aws-amplify/storage
yarn build --scope @aws-amplify/predictions
yarn build --scope aws-amplify
```

## 4. Publish to Private Server
```bash
cd packages/core
npm publish --tag fix --registry http://18.222.174.177:4873

cd ../cache
npm publish --tag fix --registry http://18.222.174.177:4873

cd ../pubsub
npm publish --tag fix --registry http://18.222.174.177:4873

cd ../api-rest
npm publish --tag fix --registry http://18.222.174.177:4873

cd ../api-graphql
npm publish --tag fix --registry http://18.222.174.177:4873

cd ../api
npm publish --tag fix --registry http://18.222.174.177:4873

cd ../auth
npm publish --tag fix --registry http://18.222.174.177:4873

cd ../datastore
npm publish --tag fix --registry http://18.222.174.177:4873

cd ../analytics
npm publish --tag fix --registry http://18.222.174.177:4873

cd ../amplify-ui-components
npm publish --tag fix --registry http://18.222.174.177:4873

cd ../amplify-ui-react
npm publish --tag fix --registry http://18.222.174.177:4873

cd ../amplify-ui
npm publish --tag fix --registry http://18.222.174.177:4873

cd ../xr
npm publish --tag fix --registry http://18.222.174.177:4873

cd ../interactions
npm publish --tag fix --registry http://18.222.174.177:4873

cd ../storage
npm publish --tag fix --registry http://18.222.174.177:4873

cd ../predictions
npm publish --tag fix --registry http://18.222.174.177:4873

cd ../aws-amplify
npm publish --tag fix --registry http://18.222.174.177:4873

cd ../../
```

## Installing
You must FIRST install every other package in `package.json`, removing all references to AmplifyJS.

Second, you change your registry URL.
```shell
npm set registry http://18.222.174.177:4873
yarn config set registry http://18.222.174.177:4873
```

Third, re-add the AmplifyJS dependencies to `package.json`.

Finally, you reset the registries.
```shell
npm set registry https://registry.npmjs.com/
yarn config set registry https://registry.yarnpkg.com/
```

## When things go WRONG
If you published the wrong build into a specific version, you will need to `unpublish` each package and then re-publish. Also, if anyone installed the wrongly published version, they will need to clean their yarn/npm cache. BUT, if you know where you messed up (ie DataStore), then just unpublish and republish that one.

#### Unpublish Example
```shell
#3.3.4
npm unpublish @aws-amplify/core@3.7.0-customDataSyncObservable --registry http://18.222.174.177:4873
npm unpublish @aws-amplify/cache@3.1.32-customDataSyncObservable --registry http://18.222.174.177:4873
npm unpublish @aws-amplify/pubsub@3.2.5-customDataSyncObservable --registry http://18.222.174.177:4873
npm unpublish @aws-amplify/api-rest@1.2.7-customDataSyncObservable --registry http://18.222.174.177:4873
npm unpublish @aws-amplify/api-graphql@1.2.7-customDataSyncObservable --registry http://18.222.174.177:4873
npm unpublish @aws-amplify/api@3.2.7-customDataSyncObservable --registry http://18.222.174.177:4873
npm unpublish @aws-amplify/auth@3.4.7-customDataSyncObservable --registry http://18.222.174.177:4873
npm unpublish @aws-amplify/datastore@2.6.1-customDataSyncObservable --registry http://18.222.174.177:4873
npm unpublish @aws-amplify/analytics@3.3.7-customDataSyncObservable --registry http://18.222.174.177:4873
npm unpublish @aws-amplify/ui-components@0.8.7-customDataSyncObservable --registry http://18.222.174.177:4873
npm unpublish @aws-amplify/ui-react@0.2.24-customDataSyncObservable --registry http://18.222.174.177:4873
npm unpublish @aws-amplify/ui@2.0.2-customDataSyncObservable --registry http://18.222.174.177:4873
npm unpublish @aws-amplify/xt@2.2.1-customDataSyncObservable --registry http://18.222.174.177:4873
npm unpublish @aws-amplify/interactions@3.3.7-customDataSyncObservable --registry http://18.222.174.177:4873
npm unpublish @aws-amplify/storage@3.3.7-customDataSyncObservable --registry http://18.222.174.177:4873
npm unpublish @aws-amplify/predictions@3.2.7-customDataSyncObservable --registry http://18.222.174.177:4873
npm unpublish @aws-amplify/xr@2.2.7-customDataSyncObservable --registry http://18.222.174.177:4873
npm unpublish aws-amplify@3.3.4-customDataSyncObservable --registry http://18.222.174.177:4873
```

#### Cleaning Yarn cache
```shell
yarn cache clean @aws-amplify/analytics
yarn cache clean @aws-amplify/api
yarn cache clean @aws-amplify/api-graphql
yarn cache clean @aws-amplify/api-rest
yarn cache clean @aws-amplify/auth
yarn cache clean @aws-amplify/cache
yarn cache clean @aws-amplify/core
yarn cache clean @aws-amplify/datastore
yarn cache clean @aws-amplify/interactions
yarn cache clean @aws-amplify/predictions
yarn cache clean @aws-amplify/pubsub
yarn cache clean @aws-amplify/storage
yarn cache clean @aws-amplify/ui
yarn cache clean @aws-amplify/ui-react
yarn cache clean @aws-amplify/ui-components
yarn cache clean @aws-amplify/xr
yarn cache clean aws-amplify
yarn cache list --pattern amplify
```