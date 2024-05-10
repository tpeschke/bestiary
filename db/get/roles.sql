select r.*, count(c.id) as combatcount, count(m.id) as movementcount, count(lv.id) as locationvitalitycount, r.role, r.socialrole, 
r.skillrole, r.attack, r.defense, r.attack_skill, r.defense_skill, r.attack_conf, r.defense_conf, r.secondaryrole, r.combatpoints, r.stress, r.panic, r.caution, r.socialpoints, r.socialsecondary,
r.fatigue, r.rollundertrauma
from bbroles r
left join bbcombatsquare c on c.roleid = r.id
left join bbmovement m on m.roleid = r.id
left join bblocationalvitality lv on lv.roleid = r.id
where r.beastid = $1
group by r.id
order by name
