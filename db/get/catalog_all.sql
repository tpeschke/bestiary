select id, name, patreon, canplayerview, thumbnail, hash, role, secondaryrole, socialrole, skillrole, defaultrole, socialsecondary, imagesource, rarity from bbindividualbeast 
where userid = $1
order by name asc