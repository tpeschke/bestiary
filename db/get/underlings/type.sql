select id, name from bbindividualbeast
where id in (select Distinct(beastid) from bbbeasttype 
                where typeid in (select typeid from bbbeasttype 
                                    where beastid = $1) and beastid != $1 and beastid != 205)
order by random()
limit 1