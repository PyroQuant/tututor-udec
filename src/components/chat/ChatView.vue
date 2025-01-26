<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import ChatMessage from './ChatMessage.vue';
import ChatInput from './ChatInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import SuggestionCards from './SuggestionCards.vue';
import { sendMessage as sendAIMessage } from '@/services/ai';
import type { Message, ChatHistory } from '@/types/chat';

const messages = ref<Message[]>([]);
const showSuggestions = ref(true);
const chatHistory = ref<ChatHistory[]>([]);
const isMenuOpen = ref(false);
const authStore = useAuthStore();
const router = useRouter();
const isLoading = ref(false);

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const createNewChat = async () => {
  const welcomeMessage = `¡Hola! Soy TuTutor UdeC, tu asistente virtual de la Universidad de Concepción. ¿En qué puedo ayudarte hoy? Puedo informarte sobre carreras, vida universitaria, servicios estudiantiles y mucho más.`;
  
  messages.value = [
    {
      id: Date.now(),
      content: welcomeMessage,
      isUser: false,
      timestamp: new Date(),
    },
  ];
  
  const newChat = {
    id: Date.now(),
    title: 'Nueva conversación',
    preview: 'Conversación iniciada',
    timestamp: new Date(),
  };
  
  chatHistory.value.unshift(newChat);
  showSuggestions.value = true;
};

const handleSuggestionSelect = (question: string) => {
  sendMessage(question);
};

const sendMessage = async (content: string) => {
  showSuggestions.value = false;
  if (isLoading.value) return;
  
  messages.value.push({
    id: Date.now(),
    content,
    isUser: true,
    timestamp: new Date(),
  });

  if (chatHistory.value.length > 0) {
    chatHistory.value[0].preview = content;
    chatHistory.value[0].timestamp = new Date();
  }

  // Add loading message
  const loadingMessageId = Date.now() + 1;
  messages.value.push({
    id: loadingMessageId,
    content: '',
    isUser: false,
    timestamp: new Date(),
    isLoading: true,
  });

  try {
    isLoading.value = true;
    const response = await sendAIMessage(content, authStore.user?.id?.toString() || Date.now().toString());
    
    // Remove loading message and add response
    messages.value = messages.value.filter(m => m.id !== loadingMessageId);
    messages.value.push({
      id: Date.now(),
      content: response.textResponse,
      isUser: false,
      timestamp: new Date(),
    });
  } catch (error) {
    // Remove loading message and add error message
    messages.value = messages.value.filter(m => m.id !== loadingMessageId);
    messages.value.push({
      id: Date.now(),
      content: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.",
      isUser: false,
      timestamp: new Date(),
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  
  if (chatHistory.value.length === 0) {
    await createNewChat();
  }
});
</script>

<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- Sidebar -->
    <div
      class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
      :class="{ 'opacity-0 pointer-events-none': !isMenuOpen, 'opacity-100': isMenuOpen }"
      @click="toggleMenu"
    ></div>

    <div
      class="fixed inset-y-0 left-0 w-80 bg-white shadow-lg transform transition-transform duration-300 z-50"
      :class="{ '-translate-x-full': !isMenuOpen, 'translate-x-0': isMenuOpen }"
    >
      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-blue-900">Historial de Chat</h2>
          <BaseButton
            @click="createNewChat"
            variant="primary"
            class="bg-blue-900 hover:bg-blue-800 rounded-full w-10 h-10 flex items-center justify-center p-0"
          >
            <span class="material-icons">add</span>
          </BaseButton>
        </div>
        <div class="space-y-4">
          <div v-if="chatHistory.length === 0" class="text-center text-gray-500 py-4">
            No hay conversaciones previas
          </div>
          <div
            v-for="chat in chatHistory"
            :key="chat.id"
            class="p-3 rounded-lg hover:bg-gray-50 cursor-pointer border"
          >
            <h3 class="font-medium text-gray-900">{{ chat.title }}</h3>
            <p class="text-sm text-gray-500 truncate">{{ chat.preview }}</p>
            <span class="text-xs text-gray-400">
              {{ new Date(chat.timestamp).toLocaleDateString('es-ES') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Header -->
    <header class="fixed top-0 left-0 right-0 bg-blue-900 text-white px-4 md:px-6 py-3 z-30 shadow-lg">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <button @click="toggleMenu" class="p-2 hover:bg-blue-800 rounded-full">
          <span class="material-icons">menu</span>
        </button>
        
        <div class="flex items-center justify-center gap-2 md:gap-3">
          <img 
            src="https://www.ruess.cl/wp-content/uploads/2018/09/udec.png" 
            alt="UdeC Logo" 
            class="h-6 md:h-8"
          />
          <h1 class="text-lg md:text-xl font-bold">TuTutor UdeC</h1>
        </div>

        <BaseButton
          variant="secondary"
          @click="handleLogout"
          class="bg-white text-blue-900 hover:bg-gray-100 rounded-full px-3 md:px-6 text-sm md:text-base"
        >
          Cerrar Sesión
        </BaseButton>
      </div>
    </header>

    <!-- Messages Container -->
    <div class="flex-1 overflow-y-auto p-4 md:p-6 pt-20 pb-32 md:pt-24 md:pb-40 max-w-4xl mx-auto w-full">
      <ChatMessage
        v-for="message in messages"
        :key="message.id"
        :content="message.content"
        :is-user="message.isUser"
        :timestamp="message.timestamp"
        :is-loading="message.isLoading"
      />
    </div>

    <!-- Fixed Bottom Section -->
    <div class="fixed bottom-0 left-0 right-0 bg-gray-50 shadow-lg">
      <div class="max-w-4xl mx-auto w-full px-4 md:px-6 pb-4 md:pb-6">
        <SuggestionCards
          v-if="showSuggestions && messages.length === 1"
          @select="handleSuggestionSelect"
          class="mb-4"
        />
        <ChatInput @send="sendMessage" />
      </div>
    </div>
  </div>
</template>
