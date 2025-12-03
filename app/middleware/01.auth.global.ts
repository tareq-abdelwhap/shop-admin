export default defineNuxtRouteMiddleware(async to => {
  if (to.path === '/') return;

  const auth = useAuthStore();
  const { authUser } = storeToRefs(auth);

  await auth.getUser();

  if (!authUser.value && !to.path.startsWith('/auth')) {
    return navigateTo('/auth/login');
  }

  if (authUser.value && to.path === '/auth/login') {
    return navigateTo('/dashboard');
  }
});
