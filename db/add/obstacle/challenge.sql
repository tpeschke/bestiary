insert into obchallenges (id, type, name, flowchart, notes)
values ((select nextval('obchallenges_id_seq')), $2, $3, $4, $5)
on CONFLICT(id)
do
    update set id = $1, type = $2, name = $3, flowchart = $4, notes = $5