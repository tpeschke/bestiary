select id, name, patreon, canplayerview, thumbnail, hash, role, secondaryrole, socialrole, skillrole, defaultrole, skillsecondary, imagesource, rarity, skillsecondary from bbindividualbeast 
where UPPER(name) like $1 ||'%' and userid = $2
order by name asc