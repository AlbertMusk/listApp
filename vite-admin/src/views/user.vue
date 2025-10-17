<template>
  <div>
    <a-page-header title="用户管理">
      <!-- 创建用户按钮 -->
      <template #extra>
        <a-button type="primary" @click="showAddUserModal">创建用户</a-button>
      </template>
    </a-page-header>


    <a-modal
      v-model:visible="addUserModalVisible"
      title="创建用户"
      @ok="handleAddUser"
      @cancel="handleAddUserCancel"
    >
      <a-form :model="addUserForm">
        <a-form-item label="用户名">
          <a-input v-model:value="addUserForm.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="密码">
          <a-input type="password" v-model:value="addUserForm.password" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item label="权限">
          <a-select v-model:value="addUserForm.role" style="width: 100%" placeholder="请选择权限">
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="director">主任</a-select-option>
            <a-select-option value="leader">班组长</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-table
      :columns="columns"
      :data-source="users"
      row-key="id"
      :loading="loading"
      bordered
    >
      <!-- 使用 bodyCell slot 渲染所有自定义列 -->
      <template #bodyCell="{ record, column }">
        <!-- 创建时间列 -->
        <template v-if="column.dataIndex === 'createdAt'">
          {{ new Date(record.createdAt).toLocaleString() }}
        </template>

        <!-- 操作列 -->
        <template v-else-if="column.dataIndex === 'operation'">
          <a-space v-if="record.role !== 'super'">
            <a-button type="primary" size="small" @click="editUser(record)">
              编辑
            </a-button>
            <a-popconfirm
              title="确定要删除该用户吗？"
              @confirm="delUser(record)"
              ok-text="确认"
              cancel-text="取消"
            >
              <a-button type="danger" size="small">删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>

        <!-- 默认显示其他列 -->
        <template v-else>
          {{ record[column.dataIndex] }}
        </template>
      </template>
    </a-table>

    <!-- 编辑用户 Modal -->
    <a-modal
      v-model:visible="editModalVisible"
      title="编辑用户"
      @ok="handleEditOk"
      @cancel="handleEditCancel"
    >
      <a-form
        :model="editForm"
      >
        <a-form-item label="用户名">
          <a-input v-model:value="editForm.username" />
        </a-form-item>
        <a-form-item label="权限">
          <a-select v-model:value="editForm.role" style="width: 100%">
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="director">主任</a-select-option>
            <a-select-option value="leader">班组长</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>


<script setup>
  import { onBeforeMount, ref } from 'vue'
  import { fetchUsers, register, updateUser, deleteUser } from '../utils/user'
  import { message } from 'ant-design-vue'
  let users = ref([])

  const loading = ref(false)

  onBeforeMount(() => {
    fetchUsers().then(res => {
      users.value = res
    })
  })

  const columns = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '权限', dataIndex: 'roleName', key: 'roleName' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' }, // 用 slot 渲染
    { title: '操作', dataIndex: 'operation', key: 'operation' },
  ]

  const editModalVisible = ref(false)
  const editForm = ref({ id: '', username: '', role: '' })

  const addUserModalVisible = ref(false)
  const addUserForm = ref({
    username: '',
    password: '',
    role: ''
  })

  function showAddUserModal() {
    addUserForm.value = { username: '', password: '', role: '' }
    addUserModalVisible.value = true
  }

  function handleAddUser() {
    if (!addUserForm.value.username || !addUserForm.value.password || !addUserForm.value.role) {
      message.warning('请填写完整信息')
      return
    }
    // 模拟 ID 和创建时间
    const newUser = {
      username: addUserForm.value.username,
      password: addUserForm.value.password,
      role: addUserForm.value.role,
    }
    register(newUser).then(res => {
      console.log(res)
      if (res) {
        message.success('用户创建成功')
        addUserModalVisible.value = false
        fetchUsers().then(res => {
          users.value = res
        })
      } else {
        message.error('用户创建失败')
      }
    }).catch(() => {
      message.error('用户创建失败')
    })
    addUserModalVisible.value = false
  }

  function handleAddUserCancel() {
    addUserModalVisible.value = false
  }


  function editUser(record) {
    editForm.value = { username: record.username, role: record.roleName, id: record._id }
    editModalVisible.value = true
  }

  function handleEditOk() {
    updateUser(editForm.value).then((res) => {
      if (!res) {
        message.error('用户信息更新失败')
        return
      }
      fetchUsers().then(res => {
        users.value = res
      })
      message.success('用户信息更新成功')
    }).catch(() => {
      message.error('用户信息更新失败')
    })
    editModalVisible.value = false
  }

  function handleEditCancel() {
    editModalVisible.value = false
  }

  function delUser(record) {
    deleteUser(record._id).then(res => {
      if (!res) {
        message.error('删除失败')
        return
      }
      fetchUsers().then(r => {
        users.value = r
        
        message.success('删除成功')
      })
    }).catch(() => {
      message.error('删除失败')
    })
  }

</script>
