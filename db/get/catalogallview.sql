select id, name, patreon, canplayerview, thumbnail, hash, role, secondaryrole, socialrole, skillrole, defaultrole, socialsecondary from bbindividualbeast 
where canplayerview is true
order by name asc