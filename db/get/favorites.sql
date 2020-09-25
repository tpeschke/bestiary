select b.id, name, patreon, canplayerview from bbindividualbeast b
join favorites f on f.beastid = b.id
where userid = $1
order by name asc