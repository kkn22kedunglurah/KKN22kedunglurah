-- 1. SETUP TABEL DATABASE --

-- Tabel Members
create table public.members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text not null,        
  division text not null,    
  major text,                
  photo_url text,            
  instagram_url text,
  linkedin_url text,
  github_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabel Prokers
create table public.prokers (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  category text not null,    
  status text default 'Belum Mulai'::text not null, 
  progress integer default 0 not null,              
  target_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabel Blogs
create table public.blogs (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  content text not null,     
  cover_image_url text,      
  author_id uuid references public.members(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabel Gallery
create table public.gallery (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text not null,   
  category text,             
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabel Guestbook
create table public.guestbook (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  message text not null,
  is_approved boolean default false not null, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- 2. MENGAKTIFKAN ROW LEVEL SECURITY (RLS) --

alter table public.members enable row level security;
alter table public.prokers enable row level security;
alter table public.blogs enable row level security;
alter table public.gallery enable row level security;
alter table public.guestbook enable row level security;


-- 3. MEMBUAT KEBIJAKAN RLS (POLICIES) --

-- Kebijakan Members: Publik bisa melihat, hanya Admin (Authenticated) yang bisa insert/update/delete
create policy "Allow public read access to members" on public.members for select using (true);
create policy "Allow auth admin to insert members" on public.members for insert to authenticated with check (true);
create policy "Allow auth admin to update members" on public.members for update to authenticated using (true);
create policy "Allow auth admin to delete members" on public.members for delete to authenticated using (true);

-- Kebijakan Prokers
create policy "Allow public read access to prokers" on public.prokers for select using (true);
create policy "Allow auth admin to insert prokers" on public.prokers for insert to authenticated with check (true);
create policy "Allow auth admin to update prokers" on public.prokers for update to authenticated using (true);
create policy "Allow auth admin to delete prokers" on public.prokers for delete to authenticated using (true);

-- Kebijakan Blogs
create policy "Allow public read access to blogs" on public.blogs for select using (true);
create policy "Allow auth admin to insert blogs" on public.blogs for insert to authenticated with check (true);
create policy "Allow auth admin to update blogs" on public.blogs for update to authenticated using (true);
create policy "Allow auth admin to delete blogs" on public.blogs for delete to authenticated using (true);

-- Kebijakan Gallery
create policy "Allow public read access to gallery" on public.gallery for select using (true);
create policy "Allow auth admin to insert gallery" on public.gallery for insert to authenticated with check (true);
create policy "Allow auth admin to update gallery" on public.gallery for update to authenticated using (true);
create policy "Allow auth admin to delete gallery" on public.gallery for delete to authenticated using (true);

-- Kebijakan Guestbook: Publik bisa melihat (jika is_approved = true), Publik juga bisa INSERT (karena guestbook).
-- Hanya Admin yang bisa UPDATE/DELETE.
create policy "Allow public read access to approved guestbook" on public.guestbook for select using (is_approved = true);
create policy "Allow public insert to guestbook" on public.guestbook for insert with check (true);
create policy "Allow auth admin full access to guestbook" on public.guestbook for all to authenticated using (true);


-- 4. SETUP SUPABASE STORAGE BUCKET --
-- Pastikan ekstensi Storage sudah aktif di project Anda
insert into storage.buckets (id, name, public) values ('kkn-assets', 'kkn-assets', true);

-- Storage Policies
create policy "Allow public read to kkn-assets" on storage.objects for select using (bucket_id = 'kkn-assets');
create policy "Allow auth admin to upload to kkn-assets" on storage.objects for insert to authenticated with check (bucket_id = 'kkn-assets');
create policy "Allow auth admin to update in kkn-assets" on storage.objects for update to authenticated using (bucket_id = 'kkn-assets');
create policy "Allow auth admin to delete from kkn-assets" on storage.objects for delete to authenticated using (bucket_id = 'kkn-assets');
