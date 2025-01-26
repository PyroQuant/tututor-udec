<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const bars = ref<number[]>(Array(20).fill(10));
const animationFrame = ref<number>();

const animate = () => {
  bars.value = bars.value.map(() => Math.random() * 50 + 10);
  animationFrame.value = requestAnimationFrame(animate);
};

onMounted(() => {
  animate();
});

onUnmounted(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
  }
});
</script>

<template>
  <div class="flex items-center justify-center gap-1 h-12">
    <div
      v-for="(height, index) in bars"
      :key="index"
      class="w-1 bg-orange-500 rounded-full transition-all duration-100"
      :style="{ height: `${height}%` }"
    ></div>
  </div>
</template>