select b.id, name, patreon, canplayerview, thumbnail, hash, role, secondaryrole, socialrole, skillrole, defaultrole from bbindividualbeast b
join favorites f on f.beastid = b.id
where f.userid = $1
order by name asc