<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="类型" prop="projectTypeName">
        <el-input
          v-model="queryParams.projectTypeName"
          placeholder="请输入选题类型名称"
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
          v-hasPermi="['service:type:add']"
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
          v-hasPermi="['service:type:edit']"
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
          v-hasPermi="['service:type:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['service:type:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" type="index" />
      <el-table-column label="类型" align="center" prop="projectTypeName" />
      <el-table-column label="创建时间" align="center" prop="createDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="state" :formatter="stateFormat" />
      <el-table-column label="备注" align="center" prop="remarks"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['service:type:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['service:type:remove']"
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

    <!-- 添加或修改选题类别管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="选题类型名称" prop="projectTypeName">
          <el-input v-model="form.projectTypeName" placeholder="请输入选题类型名称" />
        </el-form-item>
        <el-form-item label="状态">
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
        <el-divider content-position="center">选题管理信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddProject">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteProject">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="projectList" :row-class-name="rowProjectIndex" @selection-change="handleProjectSelectionChange" ref="project">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="选题名称" prop="projectName">
            <template slot-scope="scope">
              <el-input v-model="scope.row.projectName" placeholder="请输入选题名称" />
            </template>
          </el-table-column>
          <el-table-column label="选题简介" prop="projectDetail">
            <template slot-scope="scope">
              <el-input v-model="scope.row.projectDetail" placeholder="请输入选题简介" />
            </template>
          </el-table-column>
          <el-table-column label="涉及技术" prop="projectTech">
            <template slot-scope="scope">
              <el-input v-model="scope.row.projectTech" placeholder="请输入涉及技术" />
            </template>
          </el-table-column>
          <el-table-column label="选题状态" prop="state">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.state">
                <el-radio
                  v-for="dict in stateOptions"
                  :key="dict.dictValue"
                  :label="parseInt(dict.dictValue)"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
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
import { listType, getType, delType, addType, updateType, exportType } from "@/api/service/type";

export default {
  name: "Type",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedProject: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 选题类别管理表格数据
      typeList: [],
      // 选题管理表格数据
      projectList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 选题类型状态字典
      stateOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectTypeName: null,
        createDate: null,
        state: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        projectTypeName: [
          { required: true, message: "选题类型名称不能为空", trigger: "blur" }
        ],
        createDate: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        state: [
          { required: true, message: "选题类型状态不能为空", trigger: "blur" }
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
    /** 查询选题类别管理列表 */
    getList() {
      this.loading = true;
      listType(this.queryParams).then(response => {
        this.typeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 选题类型状态字典翻译
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
        projectTypeId: null,
        projectTypeName: null,
        createDate: null,
        state: 0,
        remarks: null
      };
      this.projectList = [];
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
      this.ids = selection.map(item => item.projectTypeId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加选题类别管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const projectTypeId = row.projectTypeId || this.ids
      getType(projectTypeId).then(response => {
        this.form = response.data;
        this.projectList = response.data.projectList;
        this.open = true;
        this.title = "修改选题类别管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.projectList = this.projectList;
          if (this.form.projectTypeId != null) {
            updateType(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addType(this.form).then(response => {
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
      const projectTypeIds = row.projectTypeId || this.ids;
      this.$confirm('是否确认删除选题类别管理编号为"' + projectTypeIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delType(projectTypeIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
	/** 选题管理序号 */
    rowProjectIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 选题管理添加按钮操作 */
    handleAddProject() {
      let obj = {};
      obj.projectName = "";
      obj.projectDetail = "";
      obj.projectTech = "";
      obj.createDate = "";
      obj.state = "";
      obj.remarks = "";
      this.projectList.push(obj);
    },
    /** 选题管理删除按钮操作 */
    handleDeleteProject() {
      if (this.checkedProject.length == 0) {
        this.$alert("请先选择要删除的选题管理数据", "提示", { confirmButtonText: "确定", });
      } else {
        this.projectList.splice(this.checkedProject[0].index - 1, 1);
      }
    },
    /** 单选框选中数据 */
    handleProjectSelectionChange(selection) {
      if (selection.length > 1) {
        this.$refs.project.clearSelection();
        this.$refs.project.toggleRowSelection(selection.pop());
      } else {
        this.checkedProject = selection;
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有选题类别管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportType(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
