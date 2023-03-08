select id, name, patreon, canplayerview, thumbnail, hash, role, secondaryrole, socialrole, skillrole, defaultrole, socialsecondary from bbindividualbeast 
where UPPER(name) like 'TEMPLATE,%'
order by name asc