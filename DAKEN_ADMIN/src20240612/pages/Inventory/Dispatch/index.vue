<template>
    <div class="dispatch-management">
      <t-form :model="dispatchForm" :rules="rules" ref="dispatchForm" label-width="120px">
        <t-form-item label="发货经销商" name="shipper">
          <t-select v-model="dispatchForm.shipper" placeholder="选择发货经销商" @change="handleShipperChange">
            <t-option v-for="dealer in shippers" :value="dealer.id" :key="dealer.id">
              {{ dealer.name }}
            </t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="收货经销商" name="receiver">
          <t-select v-model="dispatchForm.receiver" placeholder="选择收货经销商" :disabled="!dispatchForm.shipper">
            <t-option v-for="dealer in receivers" :value="dealer.id" :key="dealer.id">
              {{ dealer.name }}
            </t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="总数量" name="totalQuantity">
          <t-input v-model="dispatchForm.totalQuantity" type="number" @input="calculatePallets"/>
        </t-form-item>
        <t-form-item label="每托数量" name="perPalletQuantity">
          <t-input v-model="dispatchForm.perPalletQuantity" type="number" @input="calculatePallets"/>
        </t-form-item>
        <t-form-item label="托数" name="pallets">
          <t-input v-model="dispatchForm.pallets" type="number" disabled />
        </t-form-item>
        <t-form-item label="收货地点" name="location">
          <t-input v-model="dispatchForm.location" disabled />
        </t-form-item>
        <t-button @click="generateQRCodes" theme="primary">生成二维码</t-button>
      </t-form>
      
      <t-table :data="qrcodes" :columns="qrCodeColumns" row-key="security_code" />
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue';
  import axios from 'axios';
  
  const dispatchForm = reactive({
    shipper: '',
    receiver: '',
    totalQuantity: 0,
    perPalletQuantity: 50,
    pallets: 0,
    location: ''
  });
  
  const shippers = ref([]);
  const receivers = ref([]);
  const qrcodes = ref([]);
  
  const rules = {
    shipper: [{ required: true, message: '请选择发货经销商', trigger: 'change' }],
    receiver: [{ required: true, message: '请选择收货经销商', trigger: 'change' }],
    totalQuantity: [{ required: true, message: '请输入总数量', trigger: 'blur' }],
    perPalletQuantity: [{ required: true, message: '请输入每托数量', trigger: 'blur' }],
    location: [{ required: true, message: '请输入收货地点', trigger: 'blur' }]
  };
  
  const fetchShippers = async () => {
    try {
      const response = await axios.get('http://localhost:5005/inventory/shippers');
      shippers.value = response.data;
    } catch (error) {
      console.error('获取发货经销商列表失败', error);
    }
  };
  
  const fetchReceivers = async (shipperId) => {
    try {
      const response = await axios.get(`http://localhost:5005/inventory/receivers/${shipperId}`);
      receivers.value = response.data;
    } catch (error) {
      console.error('获取收货经销商列表失败', error);
    }
  };
  
  const calculatePallets = () => {
    if (dispatchForm.totalQuantity && dispatchForm.perPalletQuantity) {
      dispatchForm.pallets = Math.ceil(dispatchForm.totalQuantity / dispatchForm.perPalletQuantity);
    }
  };
  
  const handleShipperChange = async (value) => {
    await fetchReceivers(value);
    dispatchForm.receiver = '';
    dispatchForm.location = '';
  };
  
  const generateQRCodes = async () => {
    if (await dispatchForm.validate()) {
      try {
        const response = await axios.post('http://localhost:5005/inventory/generateQRCodes', {
          shipper: dispatchForm.shipper,
          receiver: dispatchForm.receiver,
          totalQuantity: dispatchForm.totalQuantity,
          perPalletQuantity: dispatchForm.perPalletQuantity,
          pallets: dispatchForm.pallets,
          timestamp: new Date().toISOString(),
          location: dispatchForm.location
        });
        qrcodes.value = response.data;
      } catch (error) {
        console.error('生成二维码失败', error);
      }
    }
  };
  
  const qrCodeColumns = [
    { title: '生成时间', colKey: 'timestamp' },
    { title: '数量', colKey: 'quantity' },
    { title: '发货经销商', colKey: 'shipper' },
    { title: '收货经销商', colKey: 'receiver' },
    { title: '收货地点', colKey: 'location' },
    { title: '防伪验证码', colKey: 'security_code' }
  ];
  
  onMounted(() => {
    fetchShippers();
  });
  </script>
  
  <style>
  .dispatch-management {
    padding: 16px;
  }
  
  .dispatch-management .t-form {
    max-width: 600px;
    margin-bottom: 24px;
  }
  
  .dispatch-management .t-table {
    margin-top: 24px;
  }
  </style>
  