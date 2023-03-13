select RANDOM() * Weight AS RandWeight, * from bbroleweights
where beastid = $1 and labelid = $2
order by RandWeight desc
limit 1;