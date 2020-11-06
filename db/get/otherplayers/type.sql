select id, name from bbindividualbeast
where id in (select Distinct(beastid) from bbbeasttype 
                where typeid in (select typeid from bbbeasttype 
                                    where beastid = $1) and beastid != $1 and beastid != 205)
    and id in (select Distinct(beastid) from bbbeasteviron
                where environid in (select environid from bbbeasteviron where beastid = $1))
order by random()
limit 1;