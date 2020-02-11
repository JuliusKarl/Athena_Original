export let  ConsumptionQueryByConsumer = {
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
          'exists': {
            'field': 'kong.consumer.username'
          }
        },
        {
          'term': {
            'app_name': 'kong'
          }
        },
        {
          'wildcard': {
            'host': '*dev*'
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
    'total_usage': {
      'terms': {
        'field': 'kong.consumer.username.keyword'
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
  }
}
