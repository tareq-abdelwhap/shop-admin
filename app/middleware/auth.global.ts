export default defineNuxtRouteMiddleware(async to => {
  const { authUser } = storeToRefs(useAuthStore());

  if (!authUser.value && !to.path.startsWith('/auth')) {
    return navigateTo('/auth/login');
  }

  if (authUser.value && to.path === '/auth/login') {
    return navigateTo('/dashboard');
  }
});
