select bbvarients.id as id, bbindividualbeast.id as varientid, name from bbindividualbeast
join bbvarients on bbvarients.varientid = bbindividualbeast.id
where beastid = $1;