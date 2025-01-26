<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import type { LoginForm, ValidationErrors } from '@/types/auth';
import { isUdecEmail } from '@/types/auth';
import 'animate.css';

const router = useRouter();
const authStore = useAuthStore();

const form = ref<LoginForm>({
  email: 'ejemplo@udec.cl',
  password: 'udec123',
  rememberMe: false
});

const errors = ref<ValidationErrors>({});
const isLoading = ref(false);

const isValid = computed(() => {
  return isUdecEmail(form.value.email) && form.value.password.length >= 6;
});

const handleSubmit = async (event: Event) => {
  event.preventDefault();
  errors.value = {};
  
  if (!isUdecEmail(form.value.email)) {
    errors.value.email = 'Debes usar tu correo @udec.cl';
    return;
  }

  if (form.value.password.length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres';
    return;
  }

  try {
    isLoading.value = true;
    await new Promise(resolve => setTimeout(resolve, 1000));
    authStore.login(form.value.email);
    const container = document.querySelector('.login-container');
    if (container) {
      container.classList.add('animate__animated', 'animate__fadeOutUp');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    router.push('/chat');
  } catch (error) {
    errors.value.email = 'Credenciales inválidas';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div 
    class="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
    style="background-image: url('https://i.ibb.co/r4f0zR1/3961a873-8fdc-4cb2-bfb2-7510646888db.jpg')"
  >
    <div class="w-full max-w-md login-container animate__animated animate__fadeIn">
      <div class="text-center mb-8">
        <div class="flex justify-center items-center gap-0 mb-4">
          <img 
            src="https://i.ibb.co/4VWMRXr/488dfff6-ad3d-4cc9-a460-9c90c27bfb4c.png" 
            alt="TuTutor Logo" 
            class="h-40 object-contain"
          />
          <img 
            src="https://www.ruess.cl/wp-content/uploads/2018/09/udec.png" 
            alt="UdeC Logo" 
            class="h-24 object-contain" style="margin-top: 25px;"
          />
        </div>
        <h2 class="text-3xl font-bold text-white drop-shadow-lg">TuTutor UdeC</h2>
        <p class="text-white mt-2 font-semibold text-lg drop-shadow-md">Tu compañero en el camino al éxito académico</p>
      </div>
      
      <div class="bg-white/95 backdrop-blur-sm px-8 py-6 rounded-lg shadow-2xl mx-4 animate__animated animate__fadeInUp animate__delay-1s">
        <form @submit.prevent="handleSubmit">
          <BaseInput
            v-model="form.email"
            label="Correo UdeC"
            type="email"
            placeholder="ejemplo@udec.cl"
            :error="errors.email"
          />
          
          <BaseInput
            v-model="form.password"
            type="password"
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            :error="errors.password"
          />
          
          <div class="mb-6">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="form.rememberMe"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-600">Recordarme</span>
            </label>
          </div>
          
          <BaseButton
            type="submit"
            variant="primary"
            :disabled="!isValid || isLoading"
            class="w-full bg-blue-900 hover:bg-blue-800 transition-all duration-300"
          >
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </BaseButton>

          <div class="mt-4 text-center">
            <router-link 
              to="/register" 
              class="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300"
            >
              ¿No tienes cuenta? Regístrate aquí
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate__animated {
  animation-duration: 0.8s;
}
</style>
