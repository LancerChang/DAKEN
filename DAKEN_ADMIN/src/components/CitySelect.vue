<template>
    <div class="city-select-container">
      <select v-model="selectedProvince" @change="onProvinceChange" class="city-select">
        <option value="">选择省份</option>
        <option v-for="province in provinces" :key="province.province">{{ province.province }}</option>
      </select>
  
      <select v-if="selectedProvince" v-model="selectedCity" class="city-select">
        <option value="">选择城市</option>
        <option v-for="city in cities" :key="city">{{ city }}</option>
      </select>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { provinceCityData } from './cityData.js';
  
  const selectedProvince = ref('');
  const selectedCity = ref('');
  
  const provinces = provinceCityData;
  
  const cities = computed(() => {
    const province = provinces.find(p => p.province === selectedProvince.value);
    return province ? province.cities : [];
  });
  
  const onProvinceChange = () => {
    selectedCity.value = '';
  };
  
  const emit = defineEmits<{
    (e: 'selectionChange', province: string, city: string): void;
  }>();
  
  watch([selectedProvince, selectedCity], () => {
    emit('selectionChange', selectedProvince.value, selectedCity.value);
  });
  </script>
  
  <style scoped>
  .city-select-container {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  .city-select {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    background-color: #fff;
    transition: border-color 0.3s;
  }
  
  .city-select:focus {
    border-color: #007bff;
    outline: none;
  }
  
  .city-select option {
    padding: 0.5rem;
  }
  </style>
  