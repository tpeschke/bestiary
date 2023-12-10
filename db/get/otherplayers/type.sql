select id, name, plural from bbindividualbeast
where id in (select Distinct(beastid) from bbbeasttype 
                where typeid in (select typeid from bbbeasttype 
                                    where beastid = $1) and beastid != $1 and beastid != 205)
    and id in (select Distinct(beastid) from bbbeastclimate
                where climateid in (select climateid from bbbeastclimate where beastid = $1))
order by random()
limit 1;