-- Enable Row Level Security
alter table profiles enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;

-- Profiles policies
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Posts policies
create policy "Anyone can read posts" on posts
  for select using (true);

create policy "Authenticated users can create posts" on posts
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update own posts" on posts
  for update using (auth.uid() = user_id);

create policy "Users can delete own posts" on posts
  for delete using (auth.uid() = user_id);

-- Comments policies
create policy "Anyone can read comments" on comments
  for select using (true);

create policy "Authenticated users can create comments" on comments
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update own comments" on comments
  for update using (auth.uid() = user_id);

create policy "Users can delete own comments" on comments
  for delete using (auth.uid() = user_id);
