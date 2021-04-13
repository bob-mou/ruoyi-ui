<template>
  <div>
    <el-button
      size="mini"
      type="text"
      icon="el-icon-s-unfold"
      @click="handleOpen()"
      v-hasPermi="['service:stu:edit']"
    >详情</el-button>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <el-form ref="form" :model="stu" :rules="rules" label-width="100px" align="left">
        <el-row>
          <el-col :span="8">
            <el-form-item label="学生学号" prop="stuNumber"  >
              <span>{{stu.stuNumber}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属学校" prop="universityId"  >
                <span>{{stu.universityName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
          <el-form-item label="所属学院" prop="collegeId" >
            <span>{{stu.collegeName}}</span>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="所属专业" prop="majorId" >
              <span>{{stu.majorName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属班级" prop="classId"  >
              <span>{{stu.className}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学校类型" prop="schoolType">
              <span>{{stu.schoolType}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="毕设名称" prop="projectName">
              <span>{{stu.projectName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="毕设描述" prop="projectDetail">
              <span>{{stu.projectDetail}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学生姓名" prop="stuName">
              <span>{{stu.stuName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="学生手机号" prop="stuPhone">
              <span>{{stu.stuPhone}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学生QQ号" prop="stuQq">
              <span>{{stu.stuQq}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学生邮箱" prop="stuEmail">
              <span>{{stu.stuEmail}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="学历" prop="stuEducation">
              <el-select v-model="stu.stuEducation" placeholder="请选择学历"   disabled="disabled">
                <el-option
                  v-for="item in educationoptions"
                  :key="item.educationkey"
                  :label="item.educationvalue"
                  :value="item.educationkey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学生状态">
              <el-radio-group v-model="stu.state"  disabled="disabled">
                <el-radio
                  v-for="dict in stateOptions"
                  :key="dict.dictValue"
                  :label="parseInt(dict.dictValue)"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remarks">
            <span>{{stu.remarks}}</span>
          </el-form-item>
        </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { listStu, getStu, delStu, addStu, updateStu, exportStu,importTemplate,allListUniversity,allListCollege ,allListMajor,allListClass} from "@/api/service/stu";
export default {
    props: {
      stu: {
        type:Object,
      }
    },
    data() {
      return {
        dialogVisible: false,
        stu: {},
        title: "学生详细信息",
        //学校列表
        universityoptions: [],
        //学院列表
        collegeoptions: [],
        //专业列表
        majoroptions: [],
        //班级列表
        classoptions: [],
        //学历
        educationoptions:[
          {educationkey:3,educationvalue:'大专'},
          {educationkey:1,educationvalue:'本科'},
          {educationkey:2,educationvalue:'研究生'},
          {educationkey:4,educationvalue:'博士'}
        ],
        // 学校类型字典
        schoolTypeOptions: [],
        // 学生状态字典
        stateOptions: [],
      };
    },created() {
      this.getList();
      this.getDicts("school_type").then(response => {
        this.schoolTypeOptions = response.data;
      });
      this.getDicts("sys_normal_disable").then(response => {
        this.stateOptions = response.data;
      });
      this.getAllUniversity();
    },
  //查询学校列表
  getAllUniversity(){
    allListUniversity().then( response =>{
      this.universityoptions=response;
    })
  },
  //学校下拉框选中学校
  getUniversityValue(){
    this.collegeoptions=[];
    this.majoroptions=[];
    this.classoptions=[];
    this.queryParams.collegeId=null;
    this.queryParams.majorId=null;
    this.queryParams.classId=null;
    this.form.collegeId=null;
    this.form.majorId=null;
    this.form.classId=null;
    if(this.queryParams.universityId||this.form.universityId){
      let param={};
      if(this.queryParams.universityId){
        param={universityId: this.queryParams.universityId}
      }else{
        param={universityId: this.form.universityId}
      }
      allListCollege(param).then(response =>{
        this.collegeoptions=response;
      })
    }
  },
  //学院下拉框选中值
  getCollegeValue(){
    this.majoroptions=[];
    this.classoptions=[];
    this.queryParams.majorId=null;
    this.queryParams.classId=null;
    this.form.majorId=null;
    this.form.classId=null;
    if(this.queryParams.collegeId||this.form.collegeId){
      let param={};
      if(this.queryParams.collegeId){
        param={collegeId: this.queryParams.collegeId}
      }else{
        param={collegeId: this.form.collegeId}
      }
      allListMajor(param).then(response =>{
        this.majoroptions=response;
      })
    }
  },
  //专业下拉框选中值
  getMajorValue(){
    this.classoptions=[];
    this.queryParams.classId=null;
    this.form.classId=null;
    if(this.queryParams.majorId||this.form.majorId){
      let param={};
      if(this.queryParams.majorId){
        param={majorId: this.queryParams.majorId}
      }else{
        param={majorId: this.form.majorId}
      }
      allListClass(param).then(response =>{
        this.classoptions=response;
      })
    }
  },
    // 学校类型字典翻译
    schoolTypeFormat(row, column) {
      return this.selectDictLabel(this.schoolTypeOptions, row.schoolType);
    },
    // 学生状态字典翻译
    stateFormat(row, column) {
      return this.selectDictLabel(this.stateOptions, row.state);
    },
    methods: {
      handleOpen(){
        this.dialogVisible = true;
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
    }
  };
</script>
