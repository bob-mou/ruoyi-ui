<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属学校ID" prop="universityId">
        <el-input
          v-model="queryParams.universityId"
          placeholder="请输入所属学校ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="本科毕业设计题目" prop="graduationProjectTitle">
        <el-input
          v-model="queryParams.graduationProjectTitle"
          placeholder="请输入本科毕业设计题目"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学生状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择学生状态" clearable size="small">
          <el-option
            v-for="dict in stateOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          v-hasPermi="['service:grad:add']"
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
          v-hasPermi="['service:grad:edit']"
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
          v-hasPermi="['service:grad:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['service:grad:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="gradList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="自然主键，学生id" align="center" prop="stuId" />
      <el-table-column label="所属班级ID" align="center" prop="classId" />
      <el-table-column label="所属专业ID" align="center" prop="majorId" />
      <el-table-column label="所属学院ID" align="center" prop="collegeId" />
      <el-table-column label="所属学校ID" align="center" prop="universityId" />
      <el-table-column label="本科学校" align="center" prop="undergraduateSchool" />
      <el-table-column label="本科学校类型" align="center" prop="undergraduateSchoolType" />
      <el-table-column label="本科专业" align="center" prop="undergraduateMajor" />
      <el-table-column label="本科毕业设计题目" align="center" prop="graduationProjectTitle" />
      <el-table-column label="本科毕业设计描述" align="center" prop="graduationProjectDetail" />
      <el-table-column label="学生状态" align="center" prop="state" :formatter="stateFormat" />
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['service:grad:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['service:grad:remove']"
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

    <!-- 添加或修改研究生管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属班级ID" prop="classId">
          <el-input v-model="form.classId" placeholder="请输入所属班级ID" />
        </el-form-item>
        <el-form-item label="所属专业ID" prop="majorId">
          <el-input v-model="form.majorId" placeholder="请输入所属专业ID" />
        </el-form-item>
        <el-form-item label="所属学院ID" prop="collegeId">
          <el-input v-model="form.collegeId" placeholder="请输入所属学院ID" />
        </el-form-item>
        <el-form-item label="所属学校ID" prop="universityId">
          <el-input v-model="form.universityId" placeholder="请输入所属学校ID" />
        </el-form-item>
        <el-form-item label="本科学校" prop="undergraduateSchool">
          <el-input v-model="form.undergraduateSchool" placeholder="请输入本科学校" />
        </el-form-item>
        <el-form-item label="本科学校类型" prop="undergraduateSchoolType">
          <el-select v-model="form.undergraduateSchoolType" placeholder="请选择本科学校类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="本科专业" prop="undergraduateMajor">
          <el-input v-model="form.undergraduateMajor" placeholder="请输入本科专业" />
        </el-form-item>
        <el-form-item label="本科毕业设计题目" prop="graduationProjectTitle">
          <el-input v-model="form.graduationProjectTitle" placeholder="请输入本科毕业设计题目" />
        </el-form-item>
        <el-form-item label="本科毕业设计描述" prop="graduationProjectDetail">
          <el-input v-model="form.graduationProjectDetail" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="学生状态">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listGrad, getGrad, delGrad, addGrad, updateGrad, exportGrad } from "@/api/service/grad";

export default {
  name: "Grad",
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
      // 研究生管理表格数据
      gradList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 学生状态字典
      stateOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        universityId: null,
        graduationProjectTitle: null,
        graduationProjectDetail: null,
        state: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        classId: [
          { required: true, message: "所属班级ID不能为空", trigger: "blur" }
        ],
        majorId: [
          { required: true, message: "所属专业ID不能为空", trigger: "blur" }
        ],
        collegeId: [
          { required: true, message: "所属学院ID不能为空", trigger: "blur" }
        ],
        universityId: [
          { required: true, message: "所属学校ID不能为空", trigger: "blur" }
        ],
        undergraduateSchool: [
          { required: true, message: "本科学校不能为空", trigger: "blur" }
        ],
        undergraduateSchoolType: [
          { required: true, message: "本科学校类型不能为空", trigger: "change" }
        ],
        undergraduateMajor: [
          { required: true, message: "本科专业不能为空", trigger: "blur" }
        ],
        graduationProjectTitle: [
          { required: true, message: "本科毕业设计题目不能为空", trigger: "blur" }
        ],
        graduationProjectDetail: [
          { required: true, message: "本科毕业设计描述不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        state: [
          { required: true, message: "学生状态不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.stateOptions = response.data;
    });
  },
  methods: {
    /** 查询研究生管理列表 */
    getList() {
      this.loading = true;
      listGrad(this.queryParams).then(response => {
        this.gradList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 学生状态字典翻译
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
        stuId: null,
        classId: null,
        majorId: null,
        collegeId: null,
        universityId: null,
        undergraduateSchool: null,
        undergraduateSchoolType: null,
        undergraduateMajor: null,
        graduationProjectTitle: null,
        graduationProjectDetail: null,
        createTime: null,
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
      this.ids = selection.map(item => item.stuId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加研究生管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const stuId = row.stuId || this.ids
      getGrad(stuId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改研究生管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.stuId != null) {
            updateGrad(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGrad(this.form).then(response => {
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
      const stuIds = row.stuId || this.ids;
      this.$confirm('是否确认删除研究生管理编号为"' + stuIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delGrad(stuIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有研究生管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportGrad(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
