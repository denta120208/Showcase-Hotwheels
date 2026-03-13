do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'product_category'
  ) then
    create type public.product_category as enum ('diecast', 'accessories', 'diorama', 'velg');
  end if;
end $$;

alter table public.products
add column if not exists category public.product_category not null default 'diecast';

create index if not exists idx_products_category on public.products(category);

