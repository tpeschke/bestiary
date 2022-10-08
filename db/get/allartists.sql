select * from bbartists
where id not in (select artistid from bbbeastartist where beastid = $1)
order by artist