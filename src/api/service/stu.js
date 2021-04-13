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
//查询所有学校列表
export function allListUniversity() {
  return request({
    url: '/service/stu/alluniversitylist',
    method: 'get',
  })
}
//查询学校下的所有学院
export function allListCollege(query){
  return request({
    url: '/service/stu/allcollegelist',
    method: 'get',
    params: query
  })
}
//查询学院下所有专业
export function allListMajor(query){
  return request({
    url: '/service/stu/allmajorlist',
    method:'get',
    params: query
  })
}
//查询专业下所有班级
export function allListClass(query){
  return request({
    url: '/service/stu/allclasslist',
    method:'get',
    params: query
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
