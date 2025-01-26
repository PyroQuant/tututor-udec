<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';

const message = ref('');
const isRecording = ref(false);
const recordingStartTime = ref<number | null>(null);
const recordingDuration = ref(0);
const recognition = ref<SpeechRecognition | null>(null);
const timerInterval = ref<number | null>(null);
const waveformBars = ref<number[]>(Array(20).fill(10));
const animationFrame = ref<number>();

const emit = defineEmits<{
  (e: 'send', message: string): void;
}>();

const formattedDuration = computed(() => {
  const minutes = Math.floor(recordingDuration.value / 60);
  const seconds = recordingDuration.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const animateWaveform = () => {
  waveformBars.value = waveformBars.value.map(() => Math.random() * 50 + 10);
  animationFrame.value = requestAnimationFrame(animateWaveform);
};

const initSpeechRecognition = () => {
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition.value = new SpeechRecognition();
    recognition.value.continuous = false;
    recognition.value.interimResults = false;
    recognition.value.lang = 'es-ES';

    recognition.value.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      message.value = transcript;
    };

    recognition.value.onend = () => {
      stopRecording();
    };
  }
};

const startRecording = () => {
  if (!recognition.value) {
    initSpeechRecognition();
  }

  if (recognition.value) {
    recognition.value.start();
    isRecording.value = true;
    recordingStartTime.value = Date.now();
    recordingDuration.value = 0;
    animateWaveform();
    
    timerInterval.value = window.setInterval(() => {
      if (recordingStartTime.value) {
        recordingDuration.value = Math.floor((Date.now() - recordingStartTime.value) / 1000);
      }
    }, 1000);
  }
};

const stopRecording = () => {
  if (recognition.value) {
    recognition.value.stop();
  }
  isRecording.value = false;
  recordingStartTime.value = null;
  
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }

  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
    animationFrame.value = undefined;
  }
};

const toggleRecording = () => {
  if (!isRecording.value) {
    startRecording();
  } else {
    stopRecording();
  }
};

const sendMessage = () => {
  if (message.value.trim()) {
    emit('send', message.value);
    message.value = '';
  }
};
</script>

<template>
  <div class="border-t p-4 bg-white shadow-lg">
    <div class="flex gap-2 items-center">
      <div 
        class="flex-1 px-4 py-3 border rounded-full focus-within:ring-2 focus-within:ring-blue-500 relative bg-white"
        style="height: 3.5rem"
      >
        <template v-if="isRecording">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="flex items-center gap-1.5 h-12">
              <div
                v-for="(height, index) in waveformBars"
                :key="index"
                class="w-1 bg-blue-500 rounded-full transition-all duration-100"
                :style="{ height: `${height}%` }"
              ></div>
            </div>
            <span class="absolute -bottom-1 text-sm text-blue-500 font-mono">
              {{ formattedDuration }}
            </span>
          </div>
        </template>
        <input
          v-else
          v-model="message"
          type="text"
          placeholder="Escribe tu mensaje..."
          class="w-full h-full focus:outline-none text-lg"
          @keyup.enter="sendMessage"
        />
      </div>
      <BaseButton
        @click="toggleRecording"
        variant="secondary"
        class="rounded-full w-14 h-14 flex items-center justify-center p-0 text-lg"
        :class="{ 'bg-blue-500 text-white': isRecording }"
      >
        <span class="material-icons text-2xl">{{ isRecording ? 'mic' : 'mic_none' }}</span>
      </BaseButton>
      <BaseButton
        v-if="!isRecording"
        @click="sendMessage"
        variant="primary"
        class="bg-blue-900 hover:bg-blue-800 rounded-full w-14 h-14 flex items-center justify-center p-0 text-lg"
      >
        <span class="material-icons text-2xl">send</span>
      </BaseButton>
    </div>
  </div>
</template>