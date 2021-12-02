insert into obpairs (id, stringid, name, body, type, index)
values ((select nextval('obpairs_id_seq')), $2, $3, $4, $5, $6)
on CONFLICT(id)
do
    update set stringid = $2, name = $3, body = $4, type = $5, index = $6