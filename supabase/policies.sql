-- Example RLS (enable and adjust to your needs)
alter table profiles enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;

-- Public read for posts/comments
create policy posts_read on posts for select using (true);
create policy comments_read on comments for select using (true);

-- Authenticated users can insert/update own content
create policy posts_ins on posts for insert with check (auth.role() = 'authenticated');
create policy comments_ins on comments for insert with check (auth.role() = 'authenticated');

-- (Adjust update/delete with owner checks if you add auth.users join)
