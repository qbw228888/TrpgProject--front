import request from "../utils/request";

const API_NAME = '/user'

export function logIn(logInForm){
  return request({
    url: `${API_NAME}/logIn`,
    method: 'post',
    data: logInForm
  })
}

export function register(registerForm){
  return request({
    url: `${API_NAME}/register`,
    method: 'post',
    data: registerForm
  })
}

export function uploadAvatar(avatar){
  return request({
    url: `${API_NAME}/avatar/upload`,
    method: 'post',
    data: avatar
  })
}
export function getAvatar(uid){
  return request({
    url: `${API_NAME}/avatar/get/${uid}`,
    method: 'get',
  })
}
export function getUser(uid){
  return request({
    url: `${API_NAME}/getOne/${uid}`,
    method: 'get'
  })
}

export function saveUser(userForm){
  return request({
    url: `${API_NAME}/save`,
    method: 'post',
    data: userForm
  })
}
