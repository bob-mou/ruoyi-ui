import request from '@/utils/request'

// 查询选题类别管理列表
export function listType(query) {
  return request({
    url: '/service/type/list',
    method: 'get',
    params: query
  })
}

// 查询选题类别管理详细
export function getType(projectTypeId) {
  return request({
    url: '/service/type/' + projectTypeId,
    method: 'get'
  })
}

// 新增选题类别管理
export function addType(data) {
  return request({
    url: '/service/type',
    method: 'post',
    data: data
  })
}

// 修改选题类别管理
export function updateType(data) {
  return request({
    url: '/service/type',
    method: 'put',
    data: data
  })
}

// 删除选题类别管理
export function delType(projectTypeId) {
  return request({
    url: '/service/type/' + projectTypeId,
    method: 'delete'
  })
}

// 导出选题类别管理
export function exportType(query) {
  return request({
    url: '/service/type/export',
    method: 'get',
    params: query
  })
}
