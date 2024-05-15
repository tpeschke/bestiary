select id, name, patreon, canplayerview, thumbnail, hash, role, secondaryrole, socialrole, skillrole, defaultrole, socialsecondary, rarity from bbindividualbeast 
where UPPER(name) like $1 ||'%' and UPPER(name) not like 'TEMPLATE,%' and userid is null
order by name asc