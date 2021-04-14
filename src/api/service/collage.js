import request from '@/utils/request'

// 查询学院管理列表
export function listCollage(query) {
  return request({
    url: '/service/collage/list',
    method: 'get',
    params: query
  })
}
// 查询学院管理详细
export function getCollage(collegeId) {
  return request({
    url: '/service/collage/' + collegeId,
    method: 'get'
  })
}

// 新增学院管理
export function addCollage(data) {
  return request({
    url: '/service/collage',
    method: 'post',
    data: data
  })
}

// 修改学院管理
export function updateCollage(data) {
  return request({
    url: '/service/collage',
    method: 'put',
    data: data
  })
}

// 删除学院管理
export function delCollage(collegeId) {
  return request({
    url: '/service/collage/' + collegeId,
    method: 'delete'
  })
}

// 导出学院管理
export function exportCollage(query) {
  return request({
    url: '/service/collage/export',
    method: 'get',
    params: query
  })
}
