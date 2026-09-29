REVOKE EXECUTE ON FUNCTION public.is_business_owner(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.can_manage_business(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.is_business_owner(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_manage_business(uuid) TO authenticated;