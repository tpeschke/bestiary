select b.id, name, plural, number_min, number_max, number From bbindividualbeast b
left join bbrankinfo ri on ri.beastid = b.id
where b.id in (select Distinct(beastid) from bbbeasteviron 
                where environid in (select environid from bbbeasteviron 
                                    where beastid = $1) and beastid != $1 and beastid != 205)
order by random()
limit 1