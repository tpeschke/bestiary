select b.id, name, plural, number_min, number_max, number From bbindividualbeast b
left join bbrankinfo ri on ri.beastid = b.id
where b.id in (select Distinct(beastid) from bbbeastclimate
                where climateid in (select climateid from bbbeastclimate
                                    where beastid = $1) and beastid != $1 and beastid != 205)
order by random()
limit 1