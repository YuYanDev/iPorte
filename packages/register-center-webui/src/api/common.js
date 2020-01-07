import ajax from '../lib/ajax'

export const getUserInfo = params =>
  ajax.request({
    url: '/api/sys/user-info',
    params,
    method: 'get'
  })