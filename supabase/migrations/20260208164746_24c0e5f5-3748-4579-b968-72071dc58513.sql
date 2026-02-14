
-- ========================================
-- ENUMS
-- ========================================
CREATE TYPE public.experience_level AS ENUM ('none', 'beginner', 'intermediate');
CREATE TYPE public.device_type AS ENUM ('laptop', 'mobile', 'both');
CREATE TYPE public.internet_quality AS ENUM ('poor', 'fair', 'good');
CREATE TYPE public.study_time AS ENUM ('morning', 'afternoon', 'night', 'flexible');
CREATE TYPE public.learning_goal AS ENUM ('job', 'freelancing', 'projects', 'improvement');
CREATE TYPE public.learning_track AS ENUM ('frontend', 'backend', 'fullstack', 'foundation');
CREATE TYPE public.learning_mode AS ENUM ('self_paced', 'live', 'mentorship', 'project', 'hybrid');
CREATE TYPE public.access_type AS ENUM ('free', 'paid');
CREATE TYPE public.enrollment_status AS ENUM ('active', 'locked');
CREATE TYPE public.payment_status AS ENUM ('pending', 'success', 'failed');
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- ========================================
-- USER ROLES TABLE (security best practice)
-- ========================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ========================================
-- HELPER FUNCTIONS (security definer)
-- ========================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ========================================
-- LEARNER PROFILES
-- ========================================
CREATE TABLE public.learner_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  timezone TEXT DEFAULT '',
  preferred_language TEXT NOT NULL DEFAULT 'English',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.learner_profiles ENABLE ROW LEVEL SECURITY;

-- ========================================
-- TECH BACKGROUND
-- ========================================
CREATE TABLE public.tech_background (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  experience_level experience_level NOT NULL DEFAULT 'none',
  learning_duration TEXT DEFAULT '',
  previous_challenges TEXT DEFAULT '',
  device device_type NOT NULL DEFAULT 'laptop',
  internet_quality internet_quality NOT NULL DEFAULT 'good',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tech_background ENABLE ROW LEVEL SECURITY;

-- ========================================
-- LEARNING COMMITMENT
-- ========================================
CREATE TABLE public.learning_commitment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  hours_per_week INTEGER NOT NULL DEFAULT 5,
  preferred_study_time study_time NOT NULL DEFAULT 'flexible',
  learning_goal learning_goal NOT NULL DEFAULT 'improvement',
  motivation TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.learning_commitment ENABLE ROW LEVEL SECURITY;

-- ========================================
-- DISCIPLINE CHECK
-- ========================================
CREATE TABLE public.discipline_check (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  follows_deadlines BOOLEAN NOT NULL DEFAULT false,
  practices_consistently BOOLEAN NOT NULL DEFAULT false,
  open_to_feedback BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.discipline_check ENABLE ROW LEVEL SECURITY;

-- ========================================
-- ENROLLMENTS
-- ========================================
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  learning_track learning_track NOT NULL DEFAULT 'foundation',
  learning_mode learning_mode NOT NULL DEFAULT 'self_paced',
  access_type access_type NOT NULL DEFAULT 'free',
  status enrollment_status NOT NULL DEFAULT 'active',
  free_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- ========================================
-- PAYMENTS
-- ========================================
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  reference TEXT NOT NULL UNIQUE,
  status payment_status NOT NULL DEFAULT 'pending',
  provider TEXT NOT NULL DEFAULT 'paystack',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- ========================================
-- RLS POLICIES: user_roles
-- ========================================
CREATE POLICY "Admins can read all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can read own role"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ========================================
-- RLS POLICIES: learner_profiles
-- ========================================
CREATE POLICY "Users can read own profile"
  ON public.learner_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own profile"
  ON public.learner_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.learner_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own profile"
  ON public.learner_profiles FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ========================================
-- RLS POLICIES: tech_background
-- ========================================
CREATE POLICY "Users can read own tech bg"
  ON public.tech_background FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own tech bg"
  ON public.tech_background FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own tech bg"
  ON public.tech_background FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own tech bg"
  ON public.tech_background FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ========================================
-- RLS POLICIES: learning_commitment
-- ========================================
CREATE POLICY "Users can read own commitment"
  ON public.learning_commitment FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own commitment"
  ON public.learning_commitment FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own commitment"
  ON public.learning_commitment FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own commitment"
  ON public.learning_commitment FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ========================================
-- RLS POLICIES: discipline_check
-- ========================================
CREATE POLICY "Users can read own discipline"
  ON public.discipline_check FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own discipline"
  ON public.discipline_check FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own discipline"
  ON public.discipline_check FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own discipline"
  ON public.discipline_check FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ========================================
-- RLS POLICIES: enrollments
-- ========================================
CREATE POLICY "Users can read own enrollment"
  ON public.enrollments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own enrollment"
  ON public.enrollments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own enrollment"
  ON public.enrollments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- ========================================
-- RLS POLICIES: payments
-- ========================================
CREATE POLICY "Users can read own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own payment"
  ON public.payments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update payments"
  ON public.payments FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ========================================
-- TIMESTAMP UPDATE FUNCTION
-- ========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;
