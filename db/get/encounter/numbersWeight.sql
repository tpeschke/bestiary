select RANDOM() * Weight AS RandWeight, * from bbencounternumbers
where beastid = $1
order by RandWeight desc
limit 1