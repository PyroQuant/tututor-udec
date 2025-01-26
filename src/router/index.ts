import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import LoginForm from '../components/auth/LoginForm.vue';
import RegisterForm from '../components/auth/RegisterForm.vue';
import ChatView from '../components/chat/ChatView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: LoginForm,
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      component: RegisterForm,
      meta: { requiresAuth: false }
    },
    {
      path: '/chat',
      component: ChatView,
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/chat');
  } else {
    next();
  }
});

export default router;
