select beastid, name from bbskillbeast b
join bbindividualbeast b2 on b2.id = b.beastid
where challengeid = $1