select noun from bbnouninfo ni
join bbnoun n on n.id = ni.nounid
where beastid = $1
order by random()
limit 1;