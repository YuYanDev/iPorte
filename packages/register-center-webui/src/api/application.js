import ajax from '../lib/ajax'

export const getApplicationList = params =>
  ajax.request({
    url: '/api/application/list',
    params,
    method: 'get'
  })