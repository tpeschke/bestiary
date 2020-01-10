delete from bbvarients
where 
beastid = $1 and varientid = $2
or 
beastid = $2 and varientid = $1