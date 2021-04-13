<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属类型" prop="projectTypeId">
        <el-select v-model="queryParams.projectTypeId" placeholder="请选择所属类型" clearable size="small">
          <el-option
            v-for="item in projectTypeoptions"
            :key="item.projectTypeId"
            :label="item.projectTypeName"
            :value="item.projectTypeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选题名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入选题名称"
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
          v-hasPermi="['service:project:add']"
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
          v-hasPermi="['service:project:edit']"
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
          v-hasPermi="['service:project:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['service:project:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="projectList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" type="index" />
      <el-table-column label="类型" align="center" prop="projectTypeName" />
      <el-table-column label="名称" align="center" prop="projectName" />
      <el-table-column label="简介" align="center" prop="projectDetail" />
      <el-table-column label="涉及技术" align="center" prop="projectTech" />
      <el-table-column label="创建时间" align="center" prop="createDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="state" :formatter="stateFormat"
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['service:project:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['service:project:remove']"
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
    <!-- 添加或修改选题管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="选题类型" prop="projectTypeId">
          <el-select v-model="form.projectTypeId" placeholder="请选择所属类型" clearable size="small">
            <el-option
              v-for="item in projectTypeoptions"
              :key="item.projectTypeId"
              :label="item.projectTypeName"
              :value="item.projectTypeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选题名称" prop="projectName">
          <el-input v-model="form.projectName" placeholder="请输入选题名称" />
        </el-form-item>
        <el-form-item label="选题简介" prop="projectDetail">
          <el-input v-model="form.projectDetail" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="涉及技术" prop="projectTech">
          <el-input v-model="form.projectTech" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="选题状态">
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
import { listProject, getProject, delProject, addProject, updateProject, exportProject } from "@/api/service/project";
import { listType} from "@/api/service/type";
export default {
  name: "Project",
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
      //项目类型列表
      projectTypeoptions: [],
      // 总条数
      total: 0,
      // 选题管理表格数据
      projectList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 选题状态字典
      stateOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectTypeId: null,
        projectName: null,
        projectDetail: null,
        projectTech: null,
        remarks: null,
        projectTypeName: null,
        createDate: null,
        state: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        projectTypeId: [
          { required: true, message: "外键选题类型ID不能为空", trigger: "change" }
        ],
        projectName: [
          { required: true, message: "选题名称不能为空", trigger: "blur" }
        ],
        projectDetail: [
          { required: true, message: "选题简介不能为空", trigger: "blur" }
        ],
        projectTech: [
          { required: true, message: "涉及技术不能为空", trigger: "blur" }
        ],
        createDate: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        state: [
          { required: true, message: "选题状态不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.stateOptions = response.data;
    });
    this.getProjrctType();
  },
  methods: {
    /** 查询选题管理列表 */
    getList() {
      this.loading = true;
      listProject(this.queryParams).then(response => {
        this.projectList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getProjrctType(){
      this.loading = true;
      listType(this.queryParams).then(response => {
        this.projectTypeoptions = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 选题状态字典翻译
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
        projectId: null,
        projectTypeId: null,
        projectName: null,
        projectDetail: null,
        projectTech: null,
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
      this.ids = selection.map(item => item.projectId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加选题管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const projectId = row.projectId || this.ids
      getProject(projectId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改选题管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.projectId != null) {
            updateProject(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProject(this.form).then(response => {
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
      const projectIds = row.projectId || this.ids;
      this.$confirm('是否确认删除选题管理编号为"' + projectIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delProject(projectIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有选题管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportProject(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
