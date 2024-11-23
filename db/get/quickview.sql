select main.id, main.name as name, r.id as roleid, r.name as rolename, r.role as roletype, r.socialrole, r.skillrole, 
r.secondaryrole as secondaryroletype, main.role as baseroletype, main.socialrole as basesocialrole, 
main.socialsecondary as basesocialsecondary, main.skillrole as baseskillrole, main.secondaryrole as basesecondaryrole, 
sp_atk, sp_def, r.attack as roleattack, r.defense as roledefense, main.vitality, r.vitality as rolevitality, main.panic, 
r.panic as rolepanic, main.hash, patreon, canplayerview, patreon, r.hash as rolehash, main.size, r.size as rolesize,
r.socialsecondary, main.combatpoints as mainpoints, r.combatpoints as rolepoints, notrauma, main.singledievitality as mainsingledievitality, 
main.knockback as mainknockback, main.panicstrength as panicstrength, main.cautionstrength as maincaution, 
main.fatiguestrength as fatigue, main.stressstrength as mainstress, main.mental as mainmental, main.largeweapons as mainlargeweapons,
r.singledievitality as rolesingledievitality, r.knockback as roleknockback, r.panicstrength as rolepanicstrength, r.cautionstrength as rolecautionstrength, 
r.fatiguestrength as rolefatiguestrength, r.stressstrength as rolestressstrength, r.mental as rolemental, 
r.largeweapons as rolelargeweapons, rolenameorder, main.socialpoints as mainsocialpoints, r.socialpoints as rolesocialpoints, 
main.skillpoints as mainskillpoints, r.skillpoints as roleskillpoints, main.rollundertrauma as mainrollundertrauma, 
r.rollundertrauma as rolerollundertrauma, main.isIncorporeal as mainisIncorporeal, r.isIncorporeal as roleisIncorporeal,
r.weaponbreakagevitality as roleweaponbreakagevitality, main.weaponbreakagevitality as mainweaponbreakagevitality
from bbindividualbeast main
left join bbroles r on main.id = r.beastid
where main.hash = $1 or r.hash = $1