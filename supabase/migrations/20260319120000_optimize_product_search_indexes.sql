create extension if not exists pg_trgm;

create index if not exists products_name_trgm_idx
  on public.products using gin (name gin_trgm_ops);

create index if not exists products_created_at_idx
  on public.products (created_at desc);

create index if not exists products_category_idx
  on public.products (category);

create index if not exists products_is_soldout_idx
  on public.products (is_soldout);

create index if not exists products_is_limited_idx
  on public.products (is_limited);
