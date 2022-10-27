select id, name, patreon, canplayerview, thumbnail, hash, role, secondaryrole, socialrole, skillrole, defaultrole from bbindividualbeast 
where UPPER(name) like $1 ||'%'
order by name asc