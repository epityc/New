-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  plan text,
  credits_remaining integer not null default 0,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Generations
create table public.generations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  arcads_id text,
  type text not null check (type in ('video', 'image')),
  model text not null,
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed', 'timeout')),
  output_url text,
  credits_used numeric not null default 0,
  created_at timestamptz default now()
);

alter table public.generations enable row level security;

create policy "Users can read own generations"
  on public.generations for select using (auth.uid() = user_id);

create policy "Users can insert own generations"
  on public.generations for insert with check (auth.uid() = user_id);
