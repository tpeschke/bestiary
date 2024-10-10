select * from bblocations
where id not in (select locationid from bbbeastlocation where beastid = $1)
order by location