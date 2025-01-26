<script setup lang="ts">
import { computed } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import LoadingDots from './LoadingDots.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const props = defineProps<{
  content: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
}>();

const userAvatar = computed(() => {
  if (props.isUser) {
    return authStore.user.avatar || '/default-user.svg';
  }
  return 'https://i.ibb.co/3YJD8vz/An-ki-RLWpq-MOpf-AVE8j-TCv-WXu-Sb-B7x-VHONt-PHEl5kt-Ee-IVms17-P2-Kf-ZFOzp-DKnbyzf0x-Bic-g3-Qx-PUE-uz.jpg';
});

const sanitizedHtml = computed(() => {
  if (props.isLoading) return '';
  const rawHtml = marked(props.content) as string;
  return DOMPurify.sanitize(rawHtml);
});
</script>

<template>
  <div
    class="flex mb-4 animate__animated animate__fadeInUp items-start gap-2"
    :class="isUser ? 'justify-end' : 'justify-start'"
  >
    <img
      :src="userAvatar"
      :alt="isUser ? 'User Avatar' : 'AI Avatar'"
      class="w-8 h-8 rounded-full object-cover mt-1"
      :class="isUser ? 'order-2' : 'order-1'"
    />
    <div
      class="max-w-[70%] rounded-lg px-4 py-2 transform transition-all duration-300 hover:scale-[1.02] relative"
      :class="{
        'bg-orange-50 text-gray-800': isUser,
        'bg-white shadow-md text-gray-800 border border-gray-100': !isUser,
        'order-1': isUser,
        'order-2': !isUser
      }"
    >
      <template v-if="isLoading">
        <LoadingDots />
      </template>
      <template v-else>
        <div 
          class="break-words prose prose-sm max-w-none"
          v-html="sanitizedHtml"
        ></div>
        <span class="text-xs text-gray-500 mt-1 block">
          {{ new Date(timestamp).toLocaleTimeString('es-ES') }}
        </span>
      </template>
      <div 
        v-if="!isLoading"
        class="absolute inset-0 bg-gradient-to-r animate__animated animate__fadeIn animate__faster"
        :class="{
          'from-orange-200/20 to-transparent': isUser,
          'from-blue-200/20 to-transparent': !isUser
        }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.animate__animated {
  animation-duration: 0.5s;
}

:deep(.prose) {
  @apply text-gray-800;
}

:deep(.prose a) {
  @apply text-blue-600 no-underline hover:underline;
}

:deep(.prose strong) {
  @apply text-gray-900 font-semibold;
}

:deep(.prose ul) {
  @apply list-disc pl-5 my-2;
}

:deep(.prose ol) {
  @apply list-decimal pl-5 my-2;
}

:deep(.prose li) {
  @apply my-1;
}

:deep(.prose p) {
  @apply my-2;
}

:deep(.prose h1, .prose h2, .prose h3, .prose h4) {
  @apply font-bold text-gray-900 my-3;
}
</style>
