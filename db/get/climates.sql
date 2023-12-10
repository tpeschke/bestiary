select bc.id as uniqueid, bc.beastid, bc.climateid, code, climate, examples from bbbeastclimate bc
join bbclimate c on c.id = bc.climateid
where beastid = $1