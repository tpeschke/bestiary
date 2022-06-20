select id, hash, name, role, secondaryrole, socialrole, skillrole from bbroles r
where r.beastid = $1
order by role, secondaryrole, socialrole, skillrole