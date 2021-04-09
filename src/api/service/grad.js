import request from '@/utils/request'

// 查询研究生管理列表
export function listGrad(query) {
  return request({
    url: '/service/grad/list',
    method: 'get',
    params: query
  })
}

// 查询研究生管理详细
export function getGrad(stuId) {
  return request({
    url: '/service/grad/' + stuId,
    method: 'get'
  })
}

// 新增研究生管理
export function addGrad(data) {
  return request({
    url: '/service/grad',
    method: 'post',
    data: data
  })
}

// 修改研究生管理
export function updateGrad(data) {
  return request({
    url: '/service/grad',
    method: 'put',
    data: data
  })
}

// 删除研究生管理
export function delGrad(stuId) {
  return request({
    url: '/service/grad/' + stuId,
    method: 'delete'
  })
}

// 导出研究生管理
export function exportGrad(query) {
  return request({
    url: '/service/grad/export',
    method: 'get',
    params: query
  })
}