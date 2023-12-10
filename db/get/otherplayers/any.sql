select id, name, plural from bbindividualbeast
where id in (select distinct(beastid) from bbbeastclimate
                    where climateid in (select climateid from bbbeastclimate where beastid = $1 and beastid != 205))
order by random()
limit 1