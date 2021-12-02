insert into obbase (stringid, complicationsingle, difficulty, failure, information, name, notes, success, threshold, time, type)
values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
on CONFLICT(stringid)
do
    update set complicationsingle = $2, difficulty = $3, failure = $4, information = $5, name = $6, notes = $7, success = $8, 
    threshold = $9, time = $10, type = $11