select RANDOM() * Weight AS RandWeight, * from bbencounterlabels
where beastid = $1
order by RandWeight desc
limit 1