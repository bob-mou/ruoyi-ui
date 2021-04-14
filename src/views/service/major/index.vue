<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="专业名称" prop="majorName">
        <el-input
          v-model="queryParams.majorName"
          placeholder="请输入专业名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
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
        <el-select v-model="queryParams.collegeId" placeholder="请选择所属学院" clearable size="small" >
          <el-option
            v-for="item in collegeoptions"
            :key="item.collegeId"
            :label="item.collegeName"
            :value="item.collegeId">
          </el-option>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="专业状态" prop="state">-->
<!--        <el-select v-model="queryParams.state" placeholder="请选择专业状态" clearable size="small">-->
<!--          <el-option-->
<!--            v-for="dict in stateOptions"-->
<!--            :key="dict.dictValue"-->
<!--            :label="dict.dictLabel"-->
<!--            :value="dict.dictValue"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
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
          v-hasPermi="['service:major:add']"
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
          v-hasPermi="['service:major:edit']"
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
          v-hasPermi="['service:major:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['service:major:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="majorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" type="index" />
      <el-table-column label="专业名称" align="center" prop="majorName" />
      <el-table-column label="所属学校" align="center" prop="universityName" />
      <el-table-column label="所属学院" align="center" prop="collegeName" />
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['service:major:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['service:major:remove']"
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

    <!-- 添加或修改专业管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="专业名称" prop="majorName">
          <el-input v-model="form.majorName" placeholder="请输入专业名称" />
        </el-form-item>
        <el-form-item label="所属学校" prop="universityId">
          <el-select v-model="form.universityId" placeholder="请选择学校" clearable size="small" @change="getUniversityValue">
            <el-option
              v-for="item in universityoptions"
              :key="item.universityId"
              :label="item.universityName"
              :value="item.universityId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属学院" prop="collegeId">
          <el-select v-model="form.collegeId" placeholder="请选择学院" clearable size="small" >
            <el-option
              v-for="item in collegeoptions"
              :key="item.collegeId"
              :label="item.collegeName"
              :value="item.collegeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" prop="createDate">
          <el-date-picker clearable size="small"
            v-model="form.createDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="专业状态">
          <el-radio-group v-model="form.state">
            <el-radio
              v-for="dict in stateOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-divider content-position="center">班级管理信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddmyClass">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeletemyClass">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="myClassList" :row-class-name="rowmyClassIndex" @selection-change="handlemyClassSelectionChange" ref="myClass">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="班级名称" prop="className">
            <template slot-scope="scope">
              <el-input v-model="scope.row.className" placeholder="请输入班级名称" />
            </template>
          </el-table-column>
<!--          <el-table-column label="创建时间" prop="createDate">-->
<!--            <template slot-scope="scope">-->
<!--              <el-date-picker-->
<!--                  v-model="scope.row.createDate"-->
<!--                  type="date"-->
<!--                  value-format="yyyy-MM-dd"-->
<!--                  placeholder="选择创建时间">-->
<!--              </el-date-picker>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column label="所属专业" prop="className">-->
<!--            <template slot-scope="scope">-->
<!--              <el-select v-model="scope.row.majorId" placeholder="请选择所属专业" clearable size="small" >-->
<!--                <el-option-->
<!--                  v-for="item in majoroptions"-->
<!--                  :key="item.majorId"-->
<!--                  :label="item.majorName"-->
<!--                  :value="item.majorId">-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column label="班级状态" prop="state">
            <template slot-scope="scope">
              <el-input v-model="scope.row.state" placeholder="请输入班级状态" />
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remarks">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remarks" placeholder="请输入备注" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMajor, getMajor, delMajor, addMajor, updateMajor, exportMajor } from "@/api/service/major";
import {allListUniversity,allListCollege, allListMajor} from "@/api/service/stu";
export default {
  name: "Major",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedmyClass: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 专业管理表格数据
      majorList: [],
      // 班级管理表格数据
      myClassList: [],
      //学校列表
      universityoptions: [],
      //学院列表
      collegeoptions: [],
      //专业列表
      majoroptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 专业状态字典
      stateOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        majorName: null,
        universityId: null,
        collegeId: null,
        state: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        majorName: [
          { required: true, message: "专业名称不能为空", trigger: "blur" }
        ],
        universityId: [
          { required: true, message: "学校不能为空", trigger: "blur" }
        ],
        collegeId: [
          { required: true, message: "学院不能为空", trigger: "blur" }
        ],
        createDate: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        state: [
          { required: true, message: "专业状态不能为空", trigger: "blur" }
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
  },
  methods: {
    /** 查询专业管理列表 */
    getList() {
      this.loading = true;
      listMajor(this.queryParams).then(response => {
        this.majorList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //获取所有学校列表
    getAllUniversity(){
      allListUniversity().then(res =>{
        this.universityoptions=res
      })
    },
    // //获取所有学院列表（不区分学校）
    // getCollegeList(){
    //   allCollegeWithoutUniversity().then(res =>{
    //     console.log(res);
    //     this.collegeoptions=res;
    //   })
    // },
    //学校列表选中值事件 (根据当前所选学校获取学校下的所有学院)
    getUniversityValue(){
      //先清空学院下拉框选项
      this.collegeoptions=[];
      //清空学院下拉框已经选中值，防止学校修改了，学院下拉框的选中值还没修改
      this.queryParams.collegeId=null;
      this.form.collegeId=null;
      //学校下拉框有选中值时(搜索时是this.queryParams.universityId有值，新增时，是this.form.universityId有值)
      if(this.queryParams.universityId||this.form.universityId){
        let param={}
        if(this.queryParams.universityId){
          param={universityId:this.queryParams.universityId }
        }else{
          param={universityId:this.form.universityId }
        }
        //获取学校下的所有学院
        allListCollege(param).then( res =>{
          this.collegeoptions=res;
        })
      }
    },
    //学院下拉框选中值改变
    // getCollegeValue(){
    //   //this.majoroptions=null;
    // },
    // 专业状态字典翻译
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
        majorId: null,
        majorName: null,
        collegeId: null,
        createDate: null,
        state: 0,
        remarks: null
      };
      this.myClassList = [];
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
      this.ids = selection.map(item => item.majorId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加专业管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row)
      this.reset();
      const majorId = row.majorId || this.ids
      getMajor(majorId).then(response => {
        this.form = response.data;
        this.myClassList = response.data.myClassList;
        this.open = true;
        this.title = "修改专业管理";
        //获取学院列表
        allListCollege({universityId: row.universityId}).then( res =>{
          this.collegeoptions=res;
        })
        //获取专业列表
        allListMajor({collegeId: row.collegeId}).then( res =>{
          this.majoroptions =res;
        })
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.collegeoptions=null;
          this.form.myClassList = this.myClassList;
          if (this.form.majorId != null) {
            updateMajor(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMajor(this.form).then(response => {
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
      const majorIds = row.majorId || this.ids;
      this.$confirm('是否确认删除专业管理编号为"' + majorIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMajor(majorIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(()=>{

      })
    },
	/** 班级管理序号 */
    rowmyClassIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 班级管理添加按钮操作 */
    handleAddmyClass() {
      let obj = {};
      obj.className = "";
      obj.createDate = "";
      obj.state = "";
      obj.remarks = "";
      this.myClassList.push(obj);
    },
    /** 班级管理删除按钮操作 */
    handleDeletemyClass() {
      if (this.checkedmyClass.length == 0) {
        this.$alert("请先选择要删除的班级管理数据", "提示", { confirmButtonText: "确定", });
      } else {
        this.$confirm('此操作将永久删除当前专业下的班级以及班级下的所有数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.myClassList.splice(this.checkedmyClass[0].index - 1, 1);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      }
    },
    /** 单选框选中数据 */
    handlemyClassSelectionChange(selection) {
      if (selection.length > 1) {
        this.$refs.myClass.clearSelection();
        this.$refs.myClass.toggleRowSelection(selection.pop());
      } else {
        this.checkedmyClass = selection;
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有专业管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportMajor(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
