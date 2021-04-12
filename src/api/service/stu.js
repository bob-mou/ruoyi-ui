import request from '@/utils/request'

// 查询学生表列表
export function listStu(query) {
  return request({
    url: '/service/stu/list',
    method: 'get',
    params: query
  })
}

// 查询学生表详细
export function getStu(stuId) {
  return request({
    url: '/service/stu/' + stuId,
    method: 'get'
  })
}

// 新增学生表
export function addStu(data) {
  return request({
    url: '/service/stu',
    method: 'post',
    data: data
  })
}

// 修改学生表
export function updateStu(data) {
  return request({
    url: '/service/stu',
    method: 'put',
    data: data
  })
}

// 删除学生表
export function delStu(stuId) {
  return request({
    url: '/service/stu/' + stuId,
    method: 'delete'
  })
}

// 导出学生表
export function exportStu(query) {
  return request({
    url: '/service/stu/export',
    method: 'get',
    params: query
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/service/stu/importTemplate',
    method: 'get'
  })
}
