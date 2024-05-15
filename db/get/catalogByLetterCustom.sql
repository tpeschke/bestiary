select id, name, patreon, canplayerview, thumbnail, hash, role, secondaryrole, socialrole, skillrole, defaultrole, socialsecondary, imagesource, rarity from bbindividualbeast 
where UPPER(name) like $1 ||'%' and userid = $2
order by name asc