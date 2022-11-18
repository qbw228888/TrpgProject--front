import request from "../utils/request";

const API_NAME = '/message'

export function getMessage(rid){
    return request({
        url: `${API_NAME}/get/${rid}`,
        method: 'get'
    })
}