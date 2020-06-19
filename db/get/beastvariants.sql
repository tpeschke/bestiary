select bbvariants.id as id, bbindividualbeast.id as variantid, name from bbindividualbeast
join bbvariants on bbvariants.variantid = bbindividualbeast.id
where beastid = $1 and patreon <= $2
order by name;