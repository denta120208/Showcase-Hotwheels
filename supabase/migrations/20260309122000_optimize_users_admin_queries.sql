create index if not exists users_role_created_at_idx
on public.users (role, created_at desc);

create index if not exists users_role_email_idx
on public.users (role, email);
