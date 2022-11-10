select id, hash, name, role, secondaryrole, socialrole, skillrole, socialsecondary from bbroles r
where r.beastid = $1
order by name