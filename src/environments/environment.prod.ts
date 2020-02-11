export const environment = {
  production: true,
  commitId: 'COMMIT_ID',
  buildTime: 'BUILD_TIME'
};
export const properties = {
  env: 'prd',
  maxPublishMsgCount: 100,
  kongApiUrl: 'https://athena.auckland.ac.nz/wrapi/gateway',
  elkApiUrl: 'https://athena.auckland.ac.nz/wrapi/apielk',
  athenaApi: 'https://athena.auckland.ac.nz/wrapi/athena',
  repo: 'bitbucket.org',
  repoTeam: 'uoa',
  springStarterUrl: 'https://athena.auckland.ac.nz/wrapi',
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
