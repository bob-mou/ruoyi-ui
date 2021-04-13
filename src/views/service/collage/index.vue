<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="学院名" prop="collegeName">
        <el-input
          v-model="queryParams.collegeName"
          placeholder="请输入学院名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属学校" prop="universityId">
        <el-select v-model="queryParams.universityId" placeholder="请选择所属学校" clearable size="small" >
          <el-option
            v-for="item in universityoptions"
            :key="item.universityId"
            :label="item.universityName"
            :value="item.universityId">
          </el-option>
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
          v-hasPermi="['service:collage:add']"
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
          v-hasPermi="['service:collage:edit']"
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
          v-hasPermi="['service:collage:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['service:collage:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="collageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" type="index" />
      <el-table-column label="学院名" align="center" prop="collegeName" />
      <el-table-column label="所属学校" align="center" prop="universityName" />
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['service:collage:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['service:collage:remove']"
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

    <!-- 添加或修改学院管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学院名" prop="collegeName">
          <el-input v-model="form.collegeName" placeholder="请输入学院名" />
        </el-form-item>
        <el-form-item label="所属学校" prop="universityId">
          <el-select v-model="form.universityId" placeholder="请选择所属学校"  size="small" >
            <el-option
              v-for="item in universityoptions"
              :key="item.universityId"
              :label="item.universityName"
              :value="item.universityId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学院状态">
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
        <el-divider content-position="center">专业管理信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddMajor">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteMajor">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="majorList" :row-class-name="rowMajorIndex" @selection-change="handleMajorSelectionChange" ref="major">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="专业名称" prop="majorName">
            <template slot-scope="scope">
              <el-input v-model="scope.row.majorName" placeholder="请输入专业名称" />
            </template>
          </el-table-column>
          <el-table-column label="所属学院" prop="collegeId">
            <template slot-scope="scope">
              <el-input v-model="scope.row.collegeId" placeholder="请选择所属学院" />
<!--              <el-select v-model="scope.row.collegeId" placeholder="请选择所属学院" clearable size="small" >-->
<!--                <el-option-->
<!--                  v-for="item in universityoptions"-->
<!--                  :key="item.universityId"-->
<!--                  :label="item.universityName"-->
<!--                  :value="item.universityId">-->
<!--                </el-option>-->
<!--              </el-select>-->
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createDate">
            <template slot-scope="scope">
              <el-input v-model="scope.row.createDate" placeholder="请输入创建时间" />
            </template>
          </el-table-column>
          <el-table-column label="学院状态" prop="state">
            <template slot-scope="scope">
              <el-input v-model="scope.row.state" placeholder="请输入学院状态" />
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
import { listCollage, getCollage, delCollage, addCollage, updateCollage, exportCollage } from "@/api/service/collage";
import {allListUniversity} from "@/api/service/stu";
export default {
  name: "Collage",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedMajor: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 学院管理表格数据
      collageList: [],
      //学校列表
      universityoptions: [],
      // 专业管理表格数据
      majorList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 学校状态字典
      stateOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        collegeName: null,
        universityId: null,
        state: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        collegeName: [
          { required: true, message: "学院名不能为空", trigger: "blur" }
        ],
        universityId: [
          { required: true, message: "外键学校ID不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        state: [
          { required: true, message: "学校状态不能为空", trigger: "blur" }
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
    /** 查询学院管理列表 */
    getList() {
      this.loading = true;
      listCollage(this.queryParams).then(response => {
        this.collageList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //获取所有学校
    getAllUniversity(){
      allListUniversity().then( res =>{
        this.universityoptions=res;
      })
    },
    // 学校状态字典翻译
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
        collegeId: null,
        collegeName: null,
        universityId: null,
        createTime: null,
        state: 0,
        remarks: null
      };
      this.majorList = [];
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
      this.ids = selection.map(item => item.collegeId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加学院管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const collegeId = row.collegeId || this.ids
      getCollage(collegeId).then(response => {
        this.form = response.data;
        this.majorList = response.data.majorList;
        this.open = true;
        this.title = "修改学院管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.majorList = this.majorList;
          if (this.form.collegeId != null) {
            updateCollage(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCollage(this.form).then(response => {
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
      const collegeIds = row.collegeId || this.ids;
      this.$confirm('是否确认删除学院管理编号为"' + collegeIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCollage(collegeIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
	/** 专业管理序号 */
    rowMajorIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 专业管理添加按钮操作 */
    handleAddMajor() {
      let obj = {};
      obj.majorName = "";
      obj.collegeId = "";
      obj.createDate = "";
      obj.state = "";
      obj.remarks = "";
      this.majorList.push(obj);
    },
    /** 专业管理删除按钮操作 */
    handleDeleteMajor() {
      if (this.checkedMajor.length == 0) {
        this.$alert("请先选择要删除的专业管理数据", "提示", { confirmButtonText: "确定", });
      } else {
        this.majorList.splice(this.checkedMajor[0].index - 1, 1);
      }
    },
    /** 单选框选中数据 */
    handleMajorSelectionChange(selection) {
      if (selection.length > 1) {
        this.$refs.major.clearSelection();
        this.$refs.major.toggleRowSelection(selection.pop());
      } else {
        this.checkedMajor = selection;
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有学院管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCollage(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
