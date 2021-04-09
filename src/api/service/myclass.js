import request from '@/utils/request'

// 查询班级管理列表
export function listMyclass(query) {
  return request({
    url: '/service/myclass/list',
    method: 'get',
    params: query
  })
}

// 查询班级管理详细
export function getMyclass(classId) {
  return request({
    url: '/service/myclass/' + classId,
    method: 'get'
  })
}

// 新增班级管理
export function addMyclass(data) {
  return request({
    url: '/service/myclass',
    method: 'post',
    data: data
  })
}

// 修改班级管理
export function updateMyclass(data) {
  return request({
    url: '/service/myclass',
    method: 'put',
    data: data
  })
}

// 删除班级管理
export function delMyclass(classId) {
  return request({
    url: '/service/myclass/' + classId,
    method: 'delete'
  })
}

// 导出班级管理
export function exportMyclass(query) {
  return request({
    url: '/service/myclass/export',
    method: 'get',
    params: query
  })
}