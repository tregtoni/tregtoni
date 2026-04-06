-- Migro kategoritë e vjetra tek kategoritë e reja
-- Ekzekuto në Supabase Dashboard > SQL Editor

update public.njoftimet set category = 'imobiliare'  where category = 'prona';
update public.njoftimet set category = 'elektronik'  where category = 'elektronike';
update public.njoftimet set category = 'shtepi'      where category = 'mobilje';
update public.njoftimet set category = 'hobi'        where category = 'sport';
update public.njoftimet set category = 'kafsha'       where category = 'kafshë';
-- makina, pune, mode mbeten të njëjta
