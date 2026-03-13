alter table public.users
add column if not exists username text;

create unique index if not exists idx_users_username on public.users(username);

