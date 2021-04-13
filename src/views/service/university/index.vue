<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="学校名" prop="universityName">
        <el-input
          v-model="queryParams.universityName"
          placeholder="请输入学校名"
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
          v-hasPermi="['service:university:add']"
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
          v-hasPermi="['service:university:edit']"
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
          v-hasPermi="['service:university:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['service:university:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="universityList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" type="index" />
      <el-table-column label="学校名" align="center" prop="universityName" />
      <el-table-column label="学校logo" align="center" prop="logoPath" >
        <template slot-scope="scope">
          <el-image
            style="width: 33%; height:33% "
            :src="scope.row.logoPath"
          ></el-image>
        </template></el-table-column>
      <el-table-column label="学校地址" align="center" prop="address" />
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['service:university:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['service:university:remove']"
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

    <!-- 添加或修改学校管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学校名" prop="universityName">
          <el-input v-model="form.universityName" placeholder="请输入学校名" />
        </el-form-item>
        <el-form-item label="学校logo" prop="logoPath" >
          <el-upload
            v-model="form.logoPath"
            ref="upload"
            action="#"
            :http-request="requestUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :limit="1"
            :on-exceed="handleExceed"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList"
            :auto-upload="false"
            list-type="picture">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="学校地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入学校地址" />
        </el-form-item>
        <el-form-item label="学校状态">
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
        <el-divider content-position="center">学院管理信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddCollege">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteCollege">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="collegeList" :row-class-name="rowCollegeIndex" @selection-change="handleCollegeSelectionChange" ref="college">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="学院名" prop="collegeName">
            <template slot-scope="scope">
              <el-input v-model="scope.row.collegeName" placeholder="请输入学院名" />
            </template>
          </el-table-column>
          <el-table-column label="学院状态" prop="state">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.state" placeholder="请输入学校状态">
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
  import { listUniversity, getUniversity, delUniversity, addUniversity, updateUniversity, exportUniversity,uploadAvatar } from "@/api/service/university";

  export default {
    name: "University",
    components: {
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 子表选中数据
        checkedCollege: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 学校管理表格数据
        universityList: [],
        // 学院管理表格数据
        collegeList: [],
        // 学校状态字典
        stateOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        fileList:[],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          universityName: null,
          address: null,
          state: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          universityName: [
            { required: true, message: "学校名不能为空", trigger: "blur" }
          ],
          logoPath: [
            { required: true, message: "学校logo不能为空", trigger: "blur" }
          ],
          address: [
            { required: true, message: "学校地址不能为空", trigger: "blur" }
          ],
          createTime: [
            { required: true, message: "学校地址不能为空", trigger: "blur" }
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
    },
    methods: {
      /** 查询学校管理列表 */
      getList() {
        this.loading = true;
        listUniversity(this.queryParams).then(response => {
          this.universityList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          universityId: null,
          universityName: null,
          logoPath: null,
          address: null,
          createTime: null,
          state: null,
          remarks: null
        };
        this.collegeList = [];
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
        this.ids = selection.map(item => item.universityId)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加学校管理";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const universityId = row.universityId || this.ids
        getUniversity(universityId).then(response => {
          this.form = response.data;
          this.collegeList = response.data.collegeList;
          this.open = true;
          this.title = "修改学校管理";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.form.collegeList = this.collegeList;
            if (this.form.universityId != null) {
              updateUniversity(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              console.log("运行到这里成功4：》》");
              addUniversity(this.form).then(response => {
                this.msgSuccess("新增成功"+response);
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const universityIds = row.universityId || this.ids;
        this.$confirm('是否确认删除学校管理编号为"' + universityIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delUniversity(universityIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 学院管理序号 */
      rowCollegeIndex({ row, rowIndex }) {
        row.index = rowIndex + 1;
      },
      /** 学院管理添加按钮操作 */
      handleAddCollege() {
        let obj = {};
        obj.collegeName = "";
        obj.state = "";
        obj.remarks = "";
        this.collegeList.push(obj);
      },
      /** 学院管理删除按钮操作 */
      handleDeleteCollege() {
        if (this.checkedCollege.length == 0) {
          this.$alert("请先选择要删除的学院管理数据", "提示", { confirmButtonText: "确定", });
        } else {
          this.collegeList.splice(this.checkedCollege[0].index - 1, 1);
        }
      },
      /** 单选框选中数据 */
      handleCollegeSelectionChange(selection) {
        if (selection.length > 1) {
          this.$refs.college.clearSelection();
          this.$refs.college.toggleRowSelection(selection.pop());
        } else {
          this.checkedCollege = selection;
        }
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有学校管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportUniversity(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      },
      //头像上传
      // 覆盖默认的上传行为
      requestUpload() {
        console.log("运行到这里成功1：》》");
        this.$refs.upload.submit().then(data => {
          this.msgSuccess("运行到这里成功2：》》");
          let formData = new FormData();
          formData.append("avatarfile", data);
          uploadAvatar(formData).then(response => {
            this.msgSuccess("提交成功：》》"+response);
            console.log("提交成功：》》"+response);
          })
        });
        console.log("运行到这里成功3：》》");
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file){
        console.log(file.name);
      },
      handleExceed(files, fileList){
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeAvatarUpload(file){
        console.log("beforeAvatarUploadfile.name:>>"+file.name);
        this.form.logoPath=file.name;
        console.log("beforeAvatarUploadfile.name:>>"+this.form.logoPath);
      }
    }
  };
</script>
