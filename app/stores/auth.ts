export const useAuthStore = defineStore('auth', () => {
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

  const login = async (email: string, password: string) => {
    const {
      data: { user },
      error: err,
    } = await supabase().auth.signInWithPassword({
      email,
      password,
    });

    if (err) return (error.value = err.message);

    const { data } = await supabase()
      .from('shop_members')
      .select(
        ` 
          id,
          shop_id:shop_id,
          shops (
            id,
            name,
            type
          )
        `
      )
      .eq('user_id', user.id)
      .single();

    setUser({
      id: data.id,
      user_id: user.id!,
      email: user.email!,
      role: data.role,
      shopId: data.shop_id,
      shopName: data.shops.name,
      shopNumber: data.shops.number,
    });

    navigateTo('/dashboard');
  };

  return { authUser, setUser, error, isLoggedIn, isOwner, login };
});
