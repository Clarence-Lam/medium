<template>
  <div>
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        增加产品
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="loading"
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column v-if="false" label="ID" prop="id" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" align="center">
        <template slot-scope="scope">
          <span>
            <a :href="scope.row.url" target="_blank">{{ scope.row.name }}</a>
          </span>
        </template>
      </el-table-column>
      <el-table-column v-for="item in tableLable" :key="item.key" :label="item.title" :prop="item.key" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row[item.key] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" :disabled="row.role==='admin'" type="danger" @click="handleModifyStatus(row,'deleted')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList()" />

  </div>
</template>
<script>
import { deleteCase } from '@/api/setting'

import Pagination from '@/components/Pagination'
export default {
  name: 'CaseTable',
  components: { Pagination },
  props: {
    table: {
      type: String,
      default() {
        return ''
      }
    },
    tableLable: {
      type: Array,
      default() {
        return []
      }
    },
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    loading: {
      type: Boolean,
      default() {
        return true
      }
    },
    total: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10
      }

    }
  },
  methods: {
    getList() {
      this.$parent.page = this.listQuery.page
      this.$parent.getCasesList()
    },
    handleModifyStatus(row, status) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$parent.loading = true
        deleteCase(row.id).then(res => {
          this.$parent.loading = false
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.$parent.getCasesList()
        })
      })
    },
    handleCreate() {
      this.$parent.handleCreate('caseForm')
    },
    handleUpdate(row) {
      this.$parent.handleUpdate(row)
    }
  }
}
</script>
