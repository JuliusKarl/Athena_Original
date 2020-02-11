export let  ConsumptionQuery = {
  'size': 0,
  'query': {
    'bool': {
      'must': [
        {
          'range' : {
            '@timestamp' : {
              'gte' : 'now-3M/M',
              'lt' :  'now'
            }
          }
        },
        {
          'match': {
            'app_name': 'kong'
          }
        },
        {
          'match': {
            'host_env': 'tst'
          }
        },
        {
          'match_phrase': {
            'kong.api.name': 'kong-loopback-basic'
          }
        }
      ]
    }
  },
  'aggregations': {
    'time_usage': {
          'date_range': {
            'field': '@timestamp',
            'ranges': [
              {
                'from': 'now-0M/M',
                'to': 'now'
              },
              {
                'from': 'now-1M/M',
                'to': 'now-0M/M-1d/d'
              },
              {
                'from': null,
                'to': 'now-1M/M-1d/d'
              }
            ]
          }
        }
      }
}
