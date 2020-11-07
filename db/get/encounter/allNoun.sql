select * from bbnoun
where id not in (select nounid from bbnouninfo where beastid = $1)