export default defineNuxtRouteMiddleware(async to => {
  const shopPermissionStore = useShopStore();
  const { role } = storeToRefs(shopPermissionStore);
  if (!role.value) await shopPermissionStore.fetchRole();

  // pages that require admin/owner only
  const adminOnly = ['/employees'];

  if (adminOnly.includes(to.path)) {
    if (role.value !== 'owner' && role.value !== 'admin') {
      return navigateTo('/dashboard');
    }
  }
});
