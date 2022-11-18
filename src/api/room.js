import request from "../utils/request";
import da from "element-ui/src/locale/lang/da";

const API_NAME = '/room'

export function getPage(current, limit, uid, roomQueryVo){
  return request({
    url: `${API_NAME}/page/${current}/${limit}/${uid}`,
    method: 'post',
    data: roomQueryVo
  })
}

export function join(rid, uid){
  return request({
    url: `${API_NAME}/join/${rid}/${uid}`,
    method: 'post'
  })
}

export function backForJoin(rid, uid, back){
  return request({
    url: `${API_NAME}/back/join/${rid}/${uid}/${back}`,
    method: 'post'
  })
}

export function getJoinedPage(current, limit, uid){
  return request({
    url: `${API_NAME}/joined/${current}/${limit}/${uid}`,
    method: 'get'
  })
}

export function getCreatedPage(current, limit, uid){
  return request({
    url: `${API_NAME}/created/${current}/${limit}/${uid}`,
    method: 'get'
  })
}

export function quit(rid, uid){
  return request({
    url: `${API_NAME}/quit/${rid}/${uid}`,
    method: 'post'
  })
}

export function saveRoom(roomForm,uid){
  return request({
    url: `${API_NAME}/create/${uid}`,
    method: 'post',
    data: roomForm
  })
}

export function removeRoom(rid,uid){
  return request({
    url: `${API_NAME}/remove/${rid}/${uid}`,
    method: 'post'
  })
}

export function uploadImage(image, rid){
  return request({
    url: `${API_NAME}/image/upload/${rid}`,
    method: 'post',
    data: image
  })
}

export function getImages(rid){
  return request({
    url: `${API_NAME}/image/get/${rid}`,
    method: 'get'
  })
}

export function deleteImage(rid,url){
  return request({
    url: `${API_NAME}/image/delete/${rid}`,
    method: 'post',
    data: url
  })
}

export function createMusic(data){
  return request({
    url: `${API_NAME}/music/create`,
    method: 'post',
    data: data
  })
}

export function uploadMusic(data, rid, id){
  return request({
    url: `${API_NAME}/music/upload/${rid}/${id}`,
    method: 'post',
    data: data
  })
}

export function uploadCover(data,id){
  return request({
    url: `${API_NAME}/music/upload/cover/${id}`,
    method: 'post',
    data: data
  })
}

export function getMusics(rid){
  return request({
    url: `${API_NAME}/music/get/${rid}`,
    method: 'get'
  })
}

export function getNickname(rid,uid){
  return request({
    url: `${API_NAME}/nickname/get/${rid}/${uid}`,
    method: 'get'
  })
}

export function setNickname(rid,uid,nickname){
  return request({
    url: `${API_NAME}/nickname/set/${rid}/${uid}/${nickname}`,
    method: 'post'
  })
}

export function updateRoom(updateRoomVo){
  return request({
    url: `${API_NAME}/update`,
    method: 'post',
    data: updateRoomVo
  })
}