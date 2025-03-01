select id, hash, name, role, secondaryrole, socialrole, skillrole, socialsecondary, skillsecondary from bbroles r
where r.beastid = $1
order by name