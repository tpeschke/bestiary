insert into obcomplications (id, stringid, name, body, index)
values ((select nextval('obpairs_id_seq')), $2, $3, $4, $5)
on CONFLICT(id)
do
    update set stringid = $2, name = $3, body = $4, index = $5