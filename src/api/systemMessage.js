import request from "../utils/request";

const API_NAME = '/system/message'

export function getList(uid){
  return request({
    url: `${API_NAME}/getList/${uid}`,
    method: 'get',
  })
}

export function sendMessage(message){
  return request({
    url: `${API_NAME}/sendMessage`,
    method: 'post',
    data: message
  })
}
