import request from '@/utils/request'

// 查询学校管理列表
export function listUniversity(query) {
  return request({
    url: '/service/university/list',
    method: 'get',
    params: query
  })
}

// 查询学校管理详细
export function getUniversity(universityId) {
  return request({
    url: '/service/university/' + universityId,
    method: 'get'
  })
}

// 新增学校管理
export function addUniversity(data) {
  return request({
    url: '/service/university',
    method: 'post',
    data: data
  })
}

// 修改学校管理
export function updateUniversity(data) {
  return request({
    url: '/service/university',
    method: 'put',
    data: data
  })
}

// 删除学校管理
export function delUniversity(universityId) {
  return request({
    url: '/service/university/' + universityId,
    method: 'delete'
  })
}

// 导出学校管理
export function exportUniversity(query) {
  return request({
    url: '/service/university/export',
    method: 'get',
    params: query
  })
}