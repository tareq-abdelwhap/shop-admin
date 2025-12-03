export const useAuthStore = defineStore('auth', () => {
  const moduleStore = useModuleStore();
  const { modules } = storeToRefs(moduleStore);

  const authUser = useCookie<null | {
    id: string;
    user_id: string;
    email: string;
    role: string;
    shopId: string;
    shopName: string;
    shopNumber?: string | null;
  }>('authUser');

  const setUser = (
    u: {
      id: string;
      user_id: string;
      email: string;
      role: string;
      shopId: string;
      shopName: string;
      shopNumber?: string | null;
    } | null
  ) => {
    authUser.value = u;
  };

  const isLoggedIn = computed(() => !!authUser.value);
  const isOwner = computed(() => authUser.value?.role === 'owner');

  const error = ref<string | null>(null);

  const getUser = async () => {
    const {
      data: { user },
      error: err,
    } = await supabase().auth.getUser();

    if (err) return await logout();

    const { data } = await shop_member(user.id);

    setUser({
      id: data.id,
      user_id: user.id!,
      email: user.email!,
      role: data.role,
      shopId: data.shop_id,
      shopName: data.shops.name,
      shopNumber: data.shops.number,
    });
  };

  const login = async (email: string, password: string) => {
    const {
      data: { user },
      error: err,
    } = await supabase().auth.signInWithPassword({
      email,
      password,
    });

    if (err) return (error.value = err.message);

    const { data: shopMember } = await shop_member(user.id);

    await moduleStore.getModules(shopMember.shop_id);
    console.log('modules', modules.value);

    setUser({
      id: shopMember.id,
      user_id: user.id!,
      email: user.email!,
      role: shopMember.role,
      shopId: shopMember.shop_id,
      shopName: shopMember.shops.name,
      shopNumber: shopMember.shops.number,
    });

    await navigateTo('/dashboard');
  };

  const logout = async () => {
    await supabase().auth.signOut();
    setUser(null);
    await navigateTo('/auth/login');
  };

  async function shop_member(userId: string) {
    const { data } = await supabase()
      .from('shop_members')
      .select(
        ` 
          id,
          shop_id:shop_id,
          role,
          shops (
            id,
            name,
            type
          )
        `
      )
      .eq('user_id', userId)
      .single();

    return { data };
  }

  return {
    authUser,
    setUser,
    error,
    isLoggedIn,
    isOwner,
    getUser,
    login,
    logout,
  };
});
