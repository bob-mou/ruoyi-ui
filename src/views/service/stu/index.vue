<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="98px">
      <el-form-item label="学生学号" prop="stuNumber">
        <el-input
          v-model="queryParams.stuNumber"
          placeholder="请输入学生学号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="学生姓名" prop="stuName">
        <el-input
          v-model="queryParams.stuName"
          placeholder="请输入学生姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学生手机号" prop="stuPhone">
        <el-input
          v-model="queryParams.stuPhone"
          placeholder="请输入学生手机号"
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
          v-hasPermi="['service:stu:add']"
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
          v-hasPermi="['service:stu:edit']"
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
          v-hasPermi="['service:stu:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['service:stu:import']"
        >导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['service:stu:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="stuList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="自然主键，学生id" align="center" prop="stuId" />
      <el-table-column label="学生学号" align="center" prop="stuNumber" />
      <el-table-column label="所属班级ID" align="center" prop="classId" />
      <el-table-column label="所属专业ID" align="center" prop="majorId" />
      <el-table-column label="所属学院ID" align="center" prop="collegeId" />
      <el-table-column label="所属学校ID" align="center" prop="universityId" />
      <el-table-column label="学校类型" align="center" prop="schoolType" :formatter="schoolTypeFormat" />
      <el-table-column label="毕设名称" align="center" prop="projectName" />
      <el-table-column label="毕设描述" align="center" prop="projectDetail" />
      <el-table-column label="学生姓名" align="center" prop="stuName" />
      <el-table-column label="学生手机号" align="center" prop="stuPhone" />
      <el-table-column label="学生QQ号" align="center" prop="stuQq" />
      <el-table-column label="学生邮箱" align="center" prop="stuEmail" />
      <el-table-column label="学历" align="center" prop="stuEducation" />
      <el-table-column label="学生状态" align="center" prop="state" :formatter="stateFormat" />
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['service:stu:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['service:stu:remove']"
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

    <!-- 添加或修改学生管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学生学号" prop="stuNumber">
          <el-input v-model="form.stuNumber" placeholder="请输入学生学号" />
        </el-form-item>
        <el-form-item label="所属班级ID" prop="classId">
          <el-select v-model="form.classId" placeholder="请选择所属班级ID">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属专业ID" prop="majorId">
          <el-select v-model="form.majorId" placeholder="请选择所属专业ID">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属学院ID" prop="collegeId">
          <el-select v-model="form.collegeId" placeholder="请选择所属学院ID">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属学校ID" prop="universityId">
          <el-select v-model="form.universityId" placeholder="请选择所属学校ID">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="学校类型" prop="schoolType">
          <el-select v-model="form.schoolType" placeholder="请选择学校类型">
            <el-option
              v-for="dict in schoolTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="毕设名称" prop="projectName">
          <el-input v-model="form.projectName" placeholder="请输入毕设名称" />
        </el-form-item>
        <el-form-item label="毕设描述" prop="projectDetail">
          <el-input v-model="form.projectDetail" placeholder="请输入毕设描述" />
        </el-form-item>
        <el-form-item label="学生姓名" prop="stuName">
          <el-input v-model="form.stuName" placeholder="请输入学生姓名" />
        </el-form-item>
        <el-form-item label="学生手机号" prop="stuPhone">
          <el-input v-model="form.stuPhone" placeholder="请输入学生手机号" />
        </el-form-item>
        <el-form-item label="学生QQ号" prop="stuQq">
          <el-input v-model="form.stuQq" placeholder="请输入学生QQ号" />
        </el-form-item>
        <el-form-item label="学生邮箱" prop="stuEmail">
          <el-input v-model="form.stuEmail" placeholder="请输入学生邮箱" />
        </el-form-item>
        <el-form-item label="学历" prop="stuEducation">
          <el-input v-model="form.stuEducation" placeholder="请输入学历" />
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
    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listStu, getStu, delStu, addStu, updateStu, exportStu,importTemplate } from "@/api/service/stu";
import { getToken } from "@/utils/auth";
export default {
  name: "Stu",
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
      // 学生管理表格数据
      stuList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 学校类型字典
      schoolTypeOptions: [],
      // 学生状态字典
      stateOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stuNumber: null,
        stuName: null,
        stuPhone: null,
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/service/stu/importData"
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stuNumber: [
          { required: true, message: "学生学号不能为空", trigger: "blur" }
        ],
        classId: [
          { required: true, message: "所属班级ID不能为空", trigger: "change" }
        ],
        majorId: [
          { required: true, message: "所属专业ID不能为空", trigger: "change" }
        ],
        collegeId: [
          { required: true, message: "所属学院ID不能为空", trigger: "change" }
        ],
        universityId: [
          { required: true, message: "所属学校ID不能为空", trigger: "change" }
        ],
        schoolType: [
          { required: true, message: "学校类型不能为空", trigger: "change" }
        ],
        stuName: [
          { required: true, message: "学生姓名不能为空", trigger: "blur" }
        ],
        stuPhone: [
          { required: true, message: "学生手机号不能为空", trigger: "blur" }
        ],
        stuEducation: [
          { required: true, message: "学历不能为空", trigger: "blur" }
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
    this.getDicts("school_type").then(response => {
      this.schoolTypeOptions = response.data;
    });
    this.getDicts("sys_normal_disable").then(response => {
      this.stateOptions = response.data;
    });
  },
  methods: {
    /** 查询学生管理列表 */
    getList() {
      this.loading = true;
      listStu(this.queryParams).then(response => {
        this.stuList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 学校类型字典翻译
    schoolTypeFormat(row, column) {
      return this.selectDictLabel(this.schoolTypeOptions, row.schoolType);
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
        stuNumber: null,
        classId: null,
        majorId: null,
        collegeId: null,
        universityId: null,
        schoolType: null,
        projectName: null,
        projectDetail: null,
        stuName: null,
        stuPhone: null,
        stuQq: null,
        stuEmail: null,
        stuEducation: null,
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
      this.title = "添加学生管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const stuId = row.stuId || this.ids
      getStu(stuId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改学生管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.stuId != null) {
            updateStu(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStu(this.form).then(response => {
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
      this.$confirm('是否确认删除学生管理编号为"' + stuIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delStu(stuIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有学生管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportStu(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>
