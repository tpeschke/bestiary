select * from bbroleweights
where beastid = $1 and labelid = $2
order by weight desc