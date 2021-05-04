select id, name, plural from bbindividualbeast
where id in (select distinct(beastid) from bbbeasteviron
                    where environid in (select environid from bbbeasteviron where beastid = $1 and beastid != 205))
order by random()
limit 1