select id, name, patreon, canplayerview, thumbnail, hash, role, secondaryrole, socialrole, skillrole, defaultrole, socialsecondary, imagesource, rarity, skillsecondary, notupdating from bbindividualbeast 
where userid = $1
order by name asc