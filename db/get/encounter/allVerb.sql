select * from bbverb
where id not in (select verbid from bbverbinfo where beastid = $1)