select bbvariants.id as id, bbindividualbeast.id as variantid, name from bbindividualbeast
join bbvariants on bbvariants.variantid = bbindividualbeast.id
where beastid = $1;