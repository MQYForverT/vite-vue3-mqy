import request from '/@/utils/request'

export const getUserInfo = (data: any): any =>
  request({
    url: '/auth/login',
    method: 'post',
    params: data
  })

export const login = (data: any): any =>
  request({
    url: '/auth/login',
    method: 'post',
    params: data
  })
