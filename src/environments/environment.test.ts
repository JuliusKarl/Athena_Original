// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    commitId: 'COMMIT_ID',
    buildTime: 'BUILD_TIME'
  };
export const properties = {
  env: 'tst',
  maxPublishMsgCount: 100,
  kongApiUrl: 'https://athena.test.auckland.ac.nz/wrapi/gateway',
  elkApiUrl: 'https://athena.test.auckland.ac.nz/wrapi/apielk',
  athenaApi: 'https://athena.test.auckland.ac.nz/wrapi/athena',
  repo: 'bitbucket.org',
  repoTeam: 'uoa',
  springStarterUrl: 'https://athena.test.auckland.ac.nz/wrapi',
  specsUrl: 'https://api{env}auckland.ac.nz/explore',
  kibanaUrl: 'https://logs.auckland.ac.nz/app/kibana#/discover'
};

export const kibanaFilters = {
  postMessageFilter: '_g=(refreshInterval:(pause:!t,value:0),' +
    'time:(from:now-15m,mode:quick,to:now))' +
    '&_a=(columns:!(message,uoa_env,traceid),' +
    'index:\'52732350-b626-11e8-86db-77dfa818d922\',' +
    'interval:auto,' +
    'query:(language:lucene,query:\'traceid:"traceId"\'),' +
    'sort:!(\'@timestamp\',desc))',
  apiLogFilter: '_g=(refreshInterval:(pause:!t,value:0),' +
    'time:(from:now-15m,mode:quick,to:now))' +
    '&_a=(columns:!(message,uoa_env,traceid),' +
    'index:\'52732350-b626-11e8-86db-77dfa818d922\',' +
    'interval:auto,' +
    'query:(language:lucene,query:\'name:"apiName"%20AND%20uoa_env:"environ"\'),' +
    'sort:!(\'@timestamp\',desc))',
  connectorlogFilter: '_g=(refreshInterval:(pause:!t,value:0),' +
    'time:(from:now-15m,mode:quick,to:now))' +
    '&_a=(columns:!(message,info,uoa_env,spanid),' +
    'index:\'52732350-b626-11e8-86db-77dfa818d922\',' +
    'interval:auto,' +
    'query:(language:lucene,query:\'info:"connection=connectorName"%20AND%20uoa_env:%20"environ"\'),' +
    'sort:!(\'@timestamp\',desc))'
};

  /*
   * In development mode, to ignore zone related error stack frames such as
   * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
   * import the following file, but please comment it out in production mode
   * because it will have performance impact when throw error
   */
  // import 'zone.js/dist/zone-error';  // Included with Angular CLI.
