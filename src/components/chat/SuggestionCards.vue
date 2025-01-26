<script setup lang="ts">
import { ref } from 'vue';

const initialSuggestions = [
  {
    shortQuestion: '¿Créditos?',
    fullQuestion: '¿Qué son los créditos?',
    icon: 'school'
  },
  {
    shortQuestion: '¿DISE?',
    fullQuestion: '¿Qué servicios ofrece la DISE?',
    icon: 'support_agent'
  },
  {
    shortQuestion: '¿Pérdida de carrera?',
    fullQuestion: '¿Qué significa estar con pérdida de carrera?',
    icon: 'warning'
  },
  {
    shortQuestion: '¿CADE?',
    fullQuestion: '¿Cuáles son los servicios que puedo acceder en el Centro de Apoyo al Desarrollo del Estudiante?',
    icon: 'psychology'
  }
];

const additionalSuggestions = [
  {
    shortQuestion: '¿Biblioteca?',
    fullQuestion: '¿Como puedo acceder a libros electronicos y otros recursos digitales?',
    icon: 'menu_book'
  },
  {
    shortQuestion: '¿Actividades Extracurriculares?',
    fullQuestion: '¿Dónde puedo encontrar información sobre Actividades Extracurriculares?',
    icon: 'event'
  },
  {
    shortQuestion: '¿Jefe de Carrera?',
    fullQuestion: '',
    icon: 'person',
    requiresInput: true,
    inputPrompt: '¿Cuál es tu carrera?',
    generateQuestion: (carrera: string) => `Necesito saber quien es mi jefe de carrera y su contacto, yo estudio ${carrera}`
  },
  {
    shortQuestion: '¿DEGyD?',
    fullQuestion: '¿Qué es la Dirección de Equidad de Género y Diversidad Sexual?',
    icon: 'diversity_3'
  }
];

const showMore = ref(false);
const userInput = ref('');
const showInputDialog = ref(false);
const selectedSuggestion = ref<any>(null);

const emit = defineEmits<{
  (e: 'select', question: string): void
}>();

const handleSuggestionClick = (suggestion: any) => {
  if (suggestion.requiresInput) {
    selectedSuggestion.value = suggestion;
    showInputDialog.value = true;
  } else {
    emit('select', suggestion.fullQuestion);
  }
};

const handleInputSubmit = () => {
  if (selectedSuggestion.value && userInput.value) {
    const question = selectedSuggestion.value.generateQuestion(userInput.value);
    emit('select', question);
    showInputDialog.value = false;
    userInput.value = '';
    selectedSuggestion.value = null;
  }
};
</script>

<template>
  <div class="space-y-4">
    <!-- Input Dialog -->
    <div v-if="showInputDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">{{ selectedSuggestion?.inputPrompt }}</h3>
        <input
          v-model="userInput"
          type="text"
          class="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingresa tu carrera"
          @keyup.enter="handleInputSubmit"
        />
        <div class="flex justify-end gap-2">
          <button
            @click="showInputDialog = false"
            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="handleInputSubmit"
            class="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>

    <!-- Suggestions -->
    <div class="flex flex-wrap gap-3 justify-center">
      <button
        v-for="suggestion in initialSuggestions"
        :key="suggestion.shortQuestion"
        class="flex items-center gap-2 px-4 py-2 bg-white/95 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100"
        @click="handleSuggestionClick(suggestion)"
      >
        <span class="material-icons text-blue-900">{{ suggestion.icon }}</span>
        <span class="text-gray-800 font-medium">{{ suggestion.shortQuestion }}</span>
      </button>
      <button
        class="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
        @click="showMore = !showMore"
      >
        <span class="material-icons">{{ showMore ? 'expand_less' : 'expand_more' }}</span>
        <span class="font-medium">{{ showMore ? 'Menos' : 'Más' }}</span>
      </button>
    </div>

    <!-- Additional Suggestions -->
    <div v-if="showMore" class="flex flex-wrap gap-3 justify-center animate__animated animate__fadeIn">
      <button
        v-for="suggestion in additionalSuggestions"
        :key="suggestion.shortQuestion"
        class="flex items-center gap-2 px-4 py-2 bg-white/95 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100"
        @click="handleSuggestionClick(suggestion)"
      >
        <span class="material-icons text-blue-900">{{ suggestion.icon }}</span>
        <span class="text-gray-800 font-medium">{{ suggestion.shortQuestion }}</span>
      </button>
    </div>
  </div>
</template>
