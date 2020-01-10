delete from bbvariants
where 
beastid = $1 and variantid = $2
or 
beastid = $2 and variantid = $1