-- Aktualizimi i funksionit get_conversations
-- Shto njoftim_id dhe njoftim_title për çdo bisedë

create or replace function public.get_conversations()
returns table (
  other_user_id     uuid,
  other_user_name   text,
  last_message      text,
  last_message_time timestamptz,
  unread_count      bigint,
  njoftim_id        uuid,
  njoftim_title     text
) language sql security invoker stable as $$
  select
    case when m.sender_id = auth.uid()
         then m.receiver_id
         else m.sender_id end                                                  as other_user_id,
    coalesce(p.full_name, 'Përdorues')                                         as other_user_name,
    (array_agg(m.content         order by m.created_at desc))[1]               as last_message,
    max(m.created_at)                                                          as last_message_time,
    count(*) filter (where m.receiver_id = auth.uid() and not m.read)         as unread_count,
    (array_agg(m.njoftim_id      order by m.created_at asc)
       filter (where m.njoftim_id is not null))[1]                             as njoftim_id,
    (array_agg(n.title           order by m.created_at asc)
       filter (where m.njoftim_id is not null))[1]                             as njoftim_title
  from public.mesazhet m
  left join public.profiles  p on p.id = (
    case when m.sender_id = auth.uid() then m.receiver_id else m.sender_id end
  )
  left join public.njoftimet n on n.id = m.njoftim_id
  where m.sender_id = auth.uid() or m.receiver_id = auth.uid()
  group by other_user_id, other_user_name
  order by last_message_time desc;
$$;
