import request from '@/utils/request'

// 查询选题管理列表
export function listProject(query) {
  return request({
    url: '/service/project/list',
    method: 'get',
    params: query
  })
}

// 查询选题管理详细
export function getProject(projectId) {
  return request({
    url: '/service/project/' + projectId,
    method: 'get'
  })
}

// 新增选题管理
export function addProject(data) {
  return request({
    url: '/service/project',
    method: 'post',
    data: data
  })
}

// 修改选题管理
export function updateProject(data) {
  return request({
    url: '/service/project',
    method: 'put',
    data: data
  })
}

// 删除选题管理
export function delProject(projectId) {
  return request({
    url: '/service/project/' + projectId,
    method: 'delete'
  })
}

// 导出选题管理
export function exportProject(query) {
  return request({
    url: '/service/project/export',
    method: 'get',
    params: query
  })
}