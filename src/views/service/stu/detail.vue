<template>
  <div>
    <el-button
      size="mini"
      type="text"
      icon="el-icon-s-unfold"
      @click="handleOpen()"
    >详情</el-button>
    <el-dialog
      :visible.sync="dialogVisible"
      width="47%"
      :before-close="handleClose">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <H2>{{this.title}}</H2>
        </div>
        <el-form ref="form" :model="stu"  label-width="100px"  style="margin-left: 7%;margin-right:7%">
        <el-row>
          <el-col :span="12">
            <el-form-item label="学生学号：" prop="stuNumber"  >
              <P align="left" style="margin: 0">
                {{stu.stuNumber}}
              </P>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属学校：" prop="universityId"  >
              <P align="left" style="margin: 0">
                {{stu.universityName}}
              </P>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="所属学院：" prop="collegeId" >
            <P align="left" style="margin: 0">
              {{stu.collegeName}}
            </P>
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属专业：" prop="majorId" >
              <P align="left" style="margin: 0">
                {{stu.majorName}}
              </P>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属班级：" prop="classId"  >
              <P align="left" style="margin: 0">
                {{stu.className}}
              </P>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校类型：" prop="schoolType">
              <P align="left" style="margin: 0">
                {{stu.schoolType}}
              </P>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毕设名称：" prop="projectName">
              <P align="left" style="margin: 0">
                {{stu.projectName}}
              </P>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毕设描述：" prop="projectDetail">
              <P align="left" style="margin: 0">
                {{stu.projectDetail}}
              </P>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生姓名：" prop="stuName">
              <P align="left" style="margin: 0">
                {{stu.stuName}}
              </P>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生手机号：" prop="stuPhone">
              <P align="left" style="margin: 0">
                {{stu.stuPhone}}
              </P>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生QQ号：" prop="stuQq">
              <P align="left" style="margin: 0">
                {{stu.stuQq}}
              </P>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生邮箱：" prop="stuEmail">
              <P align="left" style="margin: 0">
                {{stu.stuEmail}}
              </P>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学历：" prop="stuEducation">
              <el-select v-model="stu.stuEducation" placeholder="请选择学历"   disabled="disabled">
                <el-option
                  v-for="item in educationoptions"
                  :key="item.educationkey"
                  :label="item.educationvalue"
                  :value="item.educationkey">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="学生状态" prop="state">
                <P align="left" style="margin: 0" >
                  {{stu.state==1?'异常':'正常'}}
                </P>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
        <el-col :span="24">
          <el-form-item label="备注：" prop="remarks">
            <P align="left" style="margin: 0">
              {{stu.remarks}}
            </P>
          </el-form-item>
        </el-col>
        </el-row>
      </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getStu } from '@/api/service/stu'

export default {
    props: {
      stuId:'',
    },
    data() {
      return {
        dialogVisible: false,
        title:"学生详情",
        stu:{},
        //学历
        educationoptions:[
          {educationkey:3,educationvalue:'大专'},
          {educationkey:1,educationvalue:'本科'},
          {educationkey:2,educationvalue:'研究生'},
          {educationkey:4,educationvalue:'博士'}
        ],
      };
    },
    methods: {
      handleOpen: function() {
        this.dialogVisible = true;
        getStu(this.stuId).then(response => {
          this.stu=response.data;
          console.log(response.data);
          // this.stu=response;
        });
      },
      handleClose(done) {
        this.dialogVisible = false;
      }
    }
  };
</script>
