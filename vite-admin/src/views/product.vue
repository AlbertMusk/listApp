<template>
  <div>
    <!-- 筛选栏 + 新增按钮 -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
      <!-- 左侧筛选栏 -->
      <a-form layout="inline" :model="filters">
        <a-form-item label="业务员">
          <a-select v-model:value="filters.customName" allow-clear placeholder="请选择业务员" style="width: 120px;">
            <a-select-option v-for="s in customNameList" :key="s" :value="s">{{ s }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="货号">
          <a-input v-model:value="filters.orderName" placeholder="请输入货号" style="width: 120px;" />
        </a-form-item>
        <a-form-item label="装货时间">
          <a-date-picker v-model:value="filters.orderDate" style="width: 140px;" />
        </a-form-item>
        <a-form-item label="负责人">
          <a-select v-model:value="filters.completeUserName" allow-clear placeholder="请选择负责人" style="width: 120px;">
            <a-select-option v-for="m in completeUserNameList" :key="m" :value="m">{{ m }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="是否完成">
          <a-select v-model:value="filters.completed" allow-clear placeholder="请选择" style="width: 100px;">
            <a-select-option value="true">已完成</a-select-option>
            <a-select-option value="false">未完成</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="applyFilters">筛选</a-button>
        </a-form-item>
        <a-form-item>
          <a-button @click="resetFilters">重置</a-button>
        </a-form-item>
      </a-form>

      <!-- 右侧新增按钮 -->
      <a-button type="primary" @click="showAddModal">新增货号</a-button>
    </div>

    <!-- 表格 -->
    <a-table
      :columns="columns"
      :data-source="filteredData"
      row-key="id"
      :loading="loading"
      :pagination="pagination"
      bordered
      @change="handleTableChange"
    >
      <template #bodyCell="{ record, column }">
        <span v-if="['orderDate', 'completedTime', 'createTime'].includes(column.dataIndex)">
          {{ record[column.dataIndex] ? new Date(record[column.dataIndex]).toLocaleString() : '' }}
        </span>
        <span v-else-if="column.dataIndex === 'completed'">
          {{ record.completed ? '已完成' : '未完成' }}
        </span>
        <a-space v-else-if="column.dataIndex === 'operation'">
          <a-button type="success" size="small" @click.stop="() => markCompleted(record)" :disabled="record.completed">
            完成
          </a-button>
          <a-button type="primary" size="small" @click.stop="() => editItem(record)">编辑</a-button>
          <a-popconfirm
            title="确定要删除吗？"
            @confirm.stop="() => deleteItem(record)"
            ok-text="确认"
            cancel-text="取消"
          >
            <a-button type="danger" size="small">删除</a-button>
          </a-popconfirm>
        </a-space>
        <span v-else>{{ record[column.dataIndex] ?? '' }}</span>
      </template>
    </a-table>

    <!-- 新增/编辑 Modal -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalType === 'add' ? '新增货号' : '编辑货号'"
      @ok="handleOk"
      @cancel="handleCancel"
      width="700px"
    >
      <a-form :model="modalForm">
        <!-- 正则提取文本框 -->
        <a-form-item label="正则提取货号">
          <a-textarea v-model:value="extractText" placeholder="请输入完整文本" rows="4" />
          <a-button style="margin-top:8px;" type="primary" @click="handleExtract">提取</a-button>
        </a-form-item>

        <!-- 表单字段 -->
        <a-form-item label="货号名称">
          <a-input v-model:value="modalForm.orderName" />
        </a-form-item>
        <a-form-item label="业务员">
          <a-input v-model:value="modalForm.customName" />
        </a-form-item>
        <a-form-item label="数量">
          <a-input-number v-model:value="modalForm.totalAmount" style="width: 100%" min="1" />
        </a-form-item>
        <a-form-item label="规格">
          <a-input v-model:value="modalForm.weight" />
        </a-form-item>
        <a-form-item label="货号要求">
          <a-input v-model:value="modalForm.requirements" />
        </a-form-item>
        <a-form-item label="装货时间">
          <a-input v-model:value="modalForm.orderDate" />
        </a-form-item>
        <a-form-item label="负责人">
          <a-select v-model:value="modalForm.completeUserName">
            <a-select-option v-for="m in completeUserNameList" :key="m" :value="m">{{ m }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="备注">
          <a-input v-model:value="modalForm.remark" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'

// 数据
const items = ref([])
const loading = ref(false)

// 筛选
const filters = ref({ customName:'', orderName:'', orderDate:null, completeUserName:'', completed:'' })
const customNameList = ['张三', '李四', '王五']
const completeUserNameList = ['刘经理', '赵主管', '钱组长']

// 表格列 + 排序
const columns = [
  { title:'货号名称', dataIndex:'orderName', key:'orderName', sorter:(a,b)=>a.orderName.localeCompare(b.orderName) },
  { title:'业务员', dataIndex:'customName', key:'customName', sorter:(a,b)=>a.customName.localeCompare(b.customName) },
  { title:'数量', dataIndex:'totalAmount', key:'totalAmount', sorter:(a,b)=>a.totalAmount-b.totalAmount },
  { title:'规格', dataIndex:'weight', key:'weight', sorter:(a,b)=>a.weight.localeCompare(b.weight) },
  { title:'货号要求', dataIndex:'requirements', key:'requirements' },
  { title:'装货时间', dataIndex:'orderDate', key:'orderDate', sorter:(a,b)=>new Date(a.orderDate)-new Date(b.orderDate) },
  { title:'负责人', dataIndex:'completeUserName', key:'completeUserName', sorter:(a,b)=>a.completeUserName.localeCompare(b.completeUserName) },
  { title:'是否完成', dataIndex:'completed', key:'completed', sorter:(a,b)=>a.completed-b.completed },
  { title:'完成时间', dataIndex:'completedTime', key:'completedTime', sorter:(a,b)=>new Date(a.completedTime)-new Date(b.completedTime) },
  { title:'备注', dataIndex:'remark', key:'remark' },
  { title:'创建时间', dataIndex:'createTime', key:'createTime', sorter:(a,b)=>new Date(a.createTime)-new Date(b.createTime) },
  { title:'操作', dataIndex:'operation', key:'operation' }
]

// 分页
const pagination = ref({ current:1, pageSize:5, total:0 })

// 筛选+分页
const filteredData = computed(()=>{
  const data = items.value.filter(item=>{
    if(filters.value.customName && item.customName!==filters.value.customName) return false
    if(filters.value.orderName && !item.orderName.includes(filters.value.orderName)) return false
    if(filters.value.completeUserName && item.completeUserName!==filters.value.completeUserName) return false
    if(filters.value.completed){const comp=filters.value.completed==='true'; if(item.completed!==comp) return false}
    if(filters.value.orderDate){const sel=filters.value.orderDate.toDate(); const itemDate=new Date(item.orderDate); if(sel.toDateString()!==itemDate.toDateString()) return false}
    return true
  })
  pagination.value.total = data.length
  const start = (pagination.value.current-1)*pagination.value.pageSize
  return data.slice(start,start+pagination.value.pageSize)
})

// 表格变化（分页/排序）
function handleTableChange(pagi){ pagination.value.current = pagi.current }

// 筛选操作
function applyFilters(){ pagination.value.current=1; message.success('已应用筛选') }
function resetFilters(){ filters.value={ customName:'', orderName:'', orderDate:null, completeUserName:'', completed:'' }; pagination.value.current=1 }

// 新增/编辑 Modal
const modalVisible = ref(false)
const modalType = ref('add')
const modalForm = ref({ id:'', orderName:'', customName:'', totalAmount:1, weight:'', requirements:'', orderDate:null, completeUserName:'', remark:'', completed:false, completedTime:null, createTime:null })
const extractText = ref('')

function showAddModal(){ modalType.value='add'; modalForm.value={ id:'', orderName:'', customName:'', totalAmount:1, weight:'', requirements:'', orderDate:'', completeUserName:'', remark:'', completed:false, completedTime:null, createTime:null }; extractText.value=''; modalVisible.value=true }
function editItem(record){ modalType.value='edit'; modalForm.value={...record}; extractText.value=''; modalVisible.value=true }
function handleOk(){
  if(!modalForm.value.orderName||!modalForm.value.customName||!modalForm.value.completeUserName){message.warning('请填写必要信息');return}
  if(modalType.value==='add'){items.value.unshift({...modalForm.value,id:Date.now(),createTime:Date.now()});message.success('货号创建成功')}
  else{const index=items.value.findIndex(i=>i.id===modalForm.value.id);if(index>-1){items.value[index]={...modalForm.value};message.success('货号更新成功')}}
  modalVisible.value=false
}
function handleCancel(){ modalVisible.value=false }
function deleteItem(record){items.value=items.value.filter(i=>i.id!==record.id);message.success('已删除')}
function markCompleted(record){const index=items.value.findIndex(i=>i.id===record.id);if(index>-1){items.value[index].completed=true;items.value[index].completedTime=Date.now();message.success('已标记完成')}}

// 正则提取逻辑（支持多格式文本）
function handleExtract(){
  if(!extractText.value){ message.warning('请输入文本'); return }
  const text = extractText.value

  // 常见关键字匹配：业务员、货号、规格、数量、装货时间、负责人、货号要求
  const customNameMatch = text.match(/业务员[:：]?\s*(\S+)/)
  const itemMatch = text.match(/产品[:：]?\s*(\S+)/)
  const weightMatch = text.match(/规格[:：]?\s*(\S+)/)
  const totalAmountMatch = text.match(/数量[:：]?\s*(\d+)/)
  const orderDateMatch = text.match(/装货时间[:：]?\s*(\S+)/)
  const completeUserNameMatch = text.match(/负责人[:：]?\s*(\S+)/)
  const requirementsMatch = text.match(/质量要求[:：]?\s*(.+)/)

  if(customNameMatch) modalForm.value.customName = customNameMatch[1]
  if(itemMatch) modalForm.value.orderName = itemMatch[1]
  if(weightMatch) modalForm.value.weight = weightMatch[1]
  if(totalAmountMatch) modalForm.value.totalAmount = Number(totalAmountMatch[1])
  if(orderDateMatch) modalForm.value.orderDate = orderDateMatch[1]
  if(completeUserNameMatch) modalForm.value.completeUserName = completeUserNameMatch[1]
  if(requirementsMatch) modalForm.value.requirements = requirementsMatch[1].trim()

  message.success('已提取关键字段到表单')
}

// 模拟数据
onMounted(()=>{
  loading.value=true
  setTimeout(()=>{
    items.value=[
      {id:1,orderName:'货号001',customName:'张三',totalAmount:100,weight:'规格A',requirements:'要求1',orderDate:Date.now()-3600*1000,completeUserName:'刘经理',completed:false,completedTime:null,remark:'备注1',createTime:Date.now()-7200*1000},
      {id:2,orderName:'货号002',customName:'李四',totalAmount:50,weight:'规格B',requirements:'要求2',orderDate:Date.now()-1800*1000,completeUserName:'赵主管',completed:true,completedTime:Date.now()-900*1000,remark:'备注2',createTime:Date.now()-3600*1000},
      {id:3,orderName:'货号003',customName:'王五',totalAmount:30,weight:'规格C',requirements:'要求3',orderDate:Date.now()-5000*1000,completeUserName:'钱组长',completed:false,completedTime:null,remark:'备注3',createTime:Date.now()-2500*1000},
      {id:4,orderName:'货号004',customName:'张三',totalAmount:120,weight:'规格D',requirements:'要求4',orderDate:Date.now()-6000*1000,completeUserName:'刘经理',completed:false,completedTime:null,remark:'备注4',createTime:Date.now()-5000*1000}
    ]
    loading.value=false
    pagination.value.total = items.value.length
  },800)
})
</script>
