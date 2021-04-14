<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属学校" prop="universityId">
        <el-select v-model="queryParams.universityId" placeholder="请选择所属学校" clearable size="small" @change="getUniversityValue">
          <el-option
            v-for="item in universityoptions"
            :key="item.universityId"
            :label="item.universityName"
            :value="item.universityId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属学院" prop="collegeId">
        <el-select v-model="queryParams.collegeId" placeholder="请选择所属学院" clearable size="small" @change="getCollegeValue">
          <el-option
            v-for="item in collegeoptions"
            :key="item.collegeId"
            :label="item.collegeName"
            :value="item.collegeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属专业" prop="majorId">
        <el-select v-model="queryParams.majorId" placeholder="请选择所属专业" clearable size="small" @change="getMajorValue">
          <el-option
            v-for="item in majoroptions"
            :key="item.majorId"
            :label="item.majorName"
            :value="item.majorId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级名称" prop="className">
        <el-input
          v-model="queryParams.className"
          placeholder="请输入班级名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['service:myclass:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['service:myclass:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['service:myclass:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['service:myclass:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="myclassList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" type="index" />
      <el-table-column label="名称" align="center" prop="className" />
      <el-table-column label="所属专业" align="center" prop="majorName" />
      <el-table-column label="所属学院" align="center"  prop="collegeName" />
      <el-table-column label="所属学校" align="center" prop="universityName" />
      <el-table-column label="创建时间" align="center" prop="createDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['service:myclass:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['service:myclass:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改班级管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="班级名称" prop="className">
          <el-input v-model="form.className" placeholder="请输入班级名称" />
        </el-form-item>
        <el-form-item label="所属学校" prop="universityId">
          <el-select v-model="form.universityId" placeholder="请选择所属学校" clearable size="small" @change="getUniversityValue">
            <el-option
              v-for="item in universityoptions"
              :key="item.universityId"
              :label="item.universityName"
              :value="item.universityId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属学院" prop="collegeId">
          <el-select v-model="form.collegeId" placeholder="请选择所属学院" clearable size="small" @change="getCollegeValue">
            <el-option
              v-for="item in collegeoptions"
              :key="item.collegeId"
              :label="item.collegeName"
              :value="item.collegeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属专业" prop="majorId">
          <el-select v-model="form.majorId" placeholder="请选择所属专业" clearable size="small" @change="getMajorValue">
            <el-option
              v-for="item in majoroptions"
              :key="item.majorId"
              :label="item.majorName"
              :value="item.majorId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级状态">
          <el-radio-group v-model="form.state">
            <el-radio
              v-for="dict in stateOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMyclass, getMyclass, delMyclass, addMyclass, updateMyclass, exportMyclass } from "@/api/service/myclass";
import { allListUniversity,allListCollege ,allListMajor} from "@/api/service/stu";
import { listCollage } from "@/api/service/collage";
import { listMajor } from "@/api/service/major";
export default {
  name: "Myclass",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      //学校列表
      universityoptions: [],
      //学院列表
      collegeoptions: [],
      //专业列表
      majoroptions: [],
      // 班级管理表格数据
      myclassList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 班级状态字典
      stateOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        className: null,
        majorId: null,
        state: null,
        universityId: null,
        collegeId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        className: [
          { required: true, message: "班级名称不能为空", trigger: "blur" }
        ],
        majorId: [
          { required: true, message: "所属专业不能为空", trigger: "blur" }
        ],
        universityId: [
          { required: true, message: "所属学校不能为空", trigger: "blur" }
        ],
        collegeId: [
          { required: true, message: "所属学院不能为空", trigger: "blur" }
        ],
        state: [
          { required: true, message: "班级状态不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.stateOptions = response.data;
    });
    this.getAllUniversity();
    this.getCollege();
    this.getMajor();
  },
  methods: {
    /** 查询班级管理列表 */
    getList() {
      this.loading = true;
      console.log(this.queryParams);
      listMyclass(this.queryParams).then(response => {
        this.myclassList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //查询学校列表
    getAllUniversity(){
      allListUniversity().then( response =>{
        this.universityoptions=response;
      })
    },
    //查询学院列表
    getCollege(){
      this.loading = true;
      listCollage(this.queryParams).then(response => {
        this.collegeoptions = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //查询专业列表
    getMajor(){
      this.loading = true;
      listMajor(this.queryParams).then(response => {
        this.majoroptions = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //学校下拉框选中学校
    getUniversityValue(){
      this.collegeoptions=[];
      this.majoroptions=[];
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
      this.queryParams.majorId=null;
      this.form.majorId=null;
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
      this.queryParams.classId=null;
      this.form.classId=null;
      if(this.queryParams.majorId||this.form.majorId){
        let param={};
        if(this.queryParams.majorId){
          param={majorId: this.queryParams.majorId}
        }else{
          param={majorId: this.form.majorId}
        }
      }
    },
    // 班级状态字典翻译
    stateFormat(row, column) {
      return this.selectDictLabel(this.stateOptions, row.state);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        classId: null,
        className: null,
        majorId: null,
        createDate: null,
        state: 0,
        remarks: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.classId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加班级管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const classId = row.classId || this.ids
      getMyclass(classId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改班级管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.classId != null) {
            updateMyclass(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMyclass(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const classIds = row.classId || this.ids;
      this.$confirm('是否确认删除班级管理编号为"' + classIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMyclass(classIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有班级管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportMyclass(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
