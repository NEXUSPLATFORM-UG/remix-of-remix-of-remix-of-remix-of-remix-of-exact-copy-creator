CREATE TABLE public.business_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  email text NOT NULL,
  user_id uuid,
  role text NOT NULL DEFAULT 'admin',
  status text NOT NULL DEFAULT 'invited',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (business_id, email)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_members TO authenticated;
GRANT ALL ON public.business_members TO service_role;
ALTER TABLE public.business_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_business_owner(_business_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.businesses WHERE id = _business_id AND user_id = auth.uid())
$$;

CREATE OR REPLACE FUNCTION public.can_manage_business(_business_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_business_owner(_business_id) OR EXISTS (
    SELECT 1 FROM public.business_members
    WHERE business_id = _business_id AND lower(email) = lower(auth.jwt()->>'email') AND status <> 'revoked'
  )
$$;

CREATE POLICY "members visible to managers" ON public.business_members FOR SELECT TO authenticated
  USING (public.can_manage_business(business_id));
CREATE POLICY "owner invites" ON public.business_members FOR INSERT TO authenticated
  WITH CHECK (public.is_business_owner(business_id));
CREATE POLICY "owner updates" ON public.business_members FOR UPDATE TO authenticated
  USING (public.is_business_owner(business_id));
CREATE POLICY "owner removes" ON public.business_members FOR DELETE TO authenticated
  USING (public.is_business_owner(business_id));

CREATE POLICY "admins view managed business" ON public.businesses FOR SELECT TO authenticated
  USING (public.can_manage_business(id));

CREATE TABLE public.workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text NOT NULL,
  payout_method text NOT NULL DEFAULT 'mobile_money',
  bank_product_code text,
  bank_name text,
  bank_account text,
  daily_rate numeric NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workers TO authenticated;
GRANT ALL ON public.workers TO service_role;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "managers manage workers" ON public.workers FOR ALL TO authenticated
  USING (public.can_manage_business(business_id)) WITH CHECK (public.can_manage_business(business_id));

CREATE TABLE public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  work_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (worker_id, work_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance TO authenticated;
GRANT ALL ON public.attendance TO service_role;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "managers manage attendance" ON public.attendance FOR ALL TO authenticated
  USING (public.can_manage_business(business_id)) WITH CHECK (public.can_manage_business(business_id));

CREATE TABLE public.payroll_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  days integer NOT NULL DEFAULT 0,
  amount numeric NOT NULL DEFAULT 0,
  method text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  reference text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payroll_payments TO authenticated;
GRANT ALL ON public.payroll_payments TO service_role;
ALTER TABLE public.payroll_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "managers manage payroll" ON public.payroll_payments FOR ALL TO authenticated
  USING (public.can_manage_business(business_id)) WITH CHECK (public.can_manage_business(business_id));