-- Create a secure schema for Dr.IT Business Management System

-- 1. Profiles Table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  first_name text,
  last_name text,
  role text DEFAULT 'employee' CHECK (role IN ('admin', 'employee', 'sales', 'marketing')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Customers Table (CRM)
CREATE TABLE public.customers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name text NOT NULL,
  contact_name text,
  email text,
  phone text,
  address text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- 3. Products Table (Inventory)
CREATE TABLE public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  brand text NOT NULL,
  category text NOT NULL, -- e.g., 'Server', 'Switch', 'Storage'
  condition text NOT NULL, -- e.g., 'New', 'Refurbished', 'Used'
  specs jsonb DEFAULT '{}'::jsonb,
  price numeric(10,2) NOT NULL,
  quantity integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Quotes Table
CREATE TABLE public.quotes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid REFERENCES public.customers(id) ON DELETE CASCADE,
  created_by uuid REFERENCES public.profiles(id),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'rejected')),
  total_amount numeric(10,2) DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- 5. Quote Items Table
CREATE TABLE public.quote_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id uuid REFERENCES public.quotes(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  quantity integer NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL
);
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;

-- 6. Invoices Table
CREATE TABLE public.invoices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id uuid REFERENCES public.quotes(id),
  customer_id uuid REFERENCES public.customers(id),
  created_by uuid REFERENCES public.profiles(id),
  status text DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'overdue')),
  total_amount numeric(10,2) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (For now, allow authenticated users to do everything. You can restrict this later)
CREATE POLICY "Allow authenticated full access to profiles" ON public.profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access to customers" ON public.customers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access to products" ON public.products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access to quotes" ON public.quotes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access to quote_items" ON public.quote_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access to invoices" ON public.invoices FOR ALL USING (auth.role() = 'authenticated');
