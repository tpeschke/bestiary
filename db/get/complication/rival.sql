select b.id, name, number_min, number_max, number From bbindividualbeast b
left join bbrankinfo ri on ri.beastid = b.id
where b.id != 205
order by random()
limit 1