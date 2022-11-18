import request from "../utils/request";

export function getJson(url){
  return request({
    url: url,
    method: 'get',
    datatype: 'json',
    crossDomain: true
  })
}

export function readJson(url){
  getJson(url)
    .then(data => {
      return data;
    })
}
