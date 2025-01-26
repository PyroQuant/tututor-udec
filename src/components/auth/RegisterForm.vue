<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import type { RegisterForm, ValidationErrors } from '@/types/auth';
import { isUdecEmail } from '@/types/auth';

const router = useRouter();
const form = ref<RegisterForm>({
  email: '',
  password: '',
  confirmPassword: '',
  rememberMe: false
});

const errors = ref<ValidationErrors>({});
const isLoading = ref(false);

const isValid = computed(() => {
  return (
    isUdecEmail(form.value.email) &&
    form.value.password.length >= 6 &&
    form.value.password === form.value.confirmPassword
  );
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

  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden';
    return;
  }

  try {
    isLoading.value = true;
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push('/login');
  } catch (error) {
    errors.value.email = 'Error al crear la cuenta';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div 
    class="min-h-screen flex items-center justify-center bg-cover bg-center"
    style="background-image: url('https://i.ibb.co/r4f0zR1/3961a873-8fdc-4cb2-bfb2-7510646888db.jpg')"
  >
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <img 
          src="https://www.ruess.cl/wp-content/uploads/2018/09/udec.png" 
          alt="UdeC Logo" 
          class="mx-auto h-24 mb-4"
        />
        <h2 class="text-3xl font-bold text-white">Registro UdeC</h2>
        <p class="text-white mt-2">Crea tu cuenta con tu correo institucional</p>
      </div>
      
      <div class="bg-white px-8 py-6 rounded-lg shadow-lg">
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

          <BaseInput
            v-model="form.confirmPassword"
            type="password"
            label="Confirmar Contraseña"
            placeholder="Confirma tu contraseña"
            :error="errors.confirmPassword"
          />
          
          <BaseButton
            type="submit"
            variant="primary"
            :disabled="!isValid || isLoading"
            class="w-full bg-blue-600 hover:bg-blue-700 mt-6"
          >
            {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
          </BaseButton>

          <div class="mt-4 text-center">
            <router-link 
              to="/login" 
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              ¿Ya tienes cuenta? Inicia sesión aquí
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>