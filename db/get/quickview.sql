select main.id, main.name as name, r.id as roleid, r.name as rolename, r.role as roletype, r.socialrole, r.skillrole, 
r.secondaryrole as secondaryroletype, main.role as baseroletype, main.socialrole as basesocialrole, 
main.socialsecondary as basesocialsecondary, main.skillrole as baseskillrole, main.secondaryrole as basesecondaryrole, 
sp_atk, sp_def, r.attack as roleattack, r.defense as roledefense, main.vitality, r.vitality as rolevitality, main.panic, 
r.panic as rolepanic, main.hash, main.stress, r.stress as rolestress, patreon, canplayerview, patreon, main.caution, 
r.caution as rolecaution, r.hash as rolehash, main.size, r.size as rolesize, basefatigue, r.fatigue as rolefatigue,
r.socialsecondary, main.combatpoints as mainpoints, r.combatpoints as rolepoints
from bbindividualbeast main
left join bbroles r on main.id = r.beastid
where main.hash = $1 or r.hash = $1