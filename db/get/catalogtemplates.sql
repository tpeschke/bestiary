select id, name, patreon, canplayerview, thumbnail, hash, role, secondaryrole, socialrole, skillrole, defaultrole, socialsecondary, rarity from bbindividualbeast 
where UPPER(name) like 'TEMPLATE,%' and userid is null
order by name asc