select id, hash, name, role, secondaryrole, socialrole, skillrole, socialsecondary from bbroles r
where r.beastid = $1
order by name = 'Novice' desc, name = 'Apprentice' desc, name = 'Journeyman' desc, name = 'Expert' desc, name = 'Master' desc, name = 'Grandmaster' desc, name = 'Legendary' desc, name = 'Mythic' desc