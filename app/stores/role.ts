export type ShopRole =
  | 'owner'
  | 'admin'
  | 'cashier'
  | 'barber'
  | 'technician'
  | 'employee';

export const useRoleStore = defineStore('shopStore', () => {
  /* Handling Shop Role */
  const { authUser } = storeToRefs(useAuthStore());

  const role = useState<ShopRole | null>('currentShopRole', () => null);
  const loading = ref(false);

  const isOwner = computed(() => role.value === 'owner');
  const isAdmin = computed(
    () => role.value === 'admin' || role.value === 'owner'
  );
  const isEmployee = computed(
    () => !!role.value && !isOwner.value && !isAdmin.value
  );

  const fetchRole = async () => {
    if (!authUser.value) return;

    loading.value = true;

    const { data, error } = await supabase()
      .from('shop_members')
      .select('role')
      .eq('shop_id', authUser.value.shopId)
      .eq('user_id', authUser.value.user_id)
      .single();

    loading.value = false;

    if (error) {
      console.error('Failed to fetch role', error);
      role.value = null;
      return;
    }

    role.value = data.role as ShopRole;
  };

  return {
    /* Handling Shop Role */
    role,
    loading,
    isOwner,
    isAdmin,
    isEmployee,
    fetchRole,
  };
});
