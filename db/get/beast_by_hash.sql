select main.id, main.name as name, r.id as roleid, r.name as rolename, r.role as roletype, main.role as baseroletype, 
main.vitality, r.vitality as rolevitality, main.panic, r.panic as rolepanic, main.hash as mainhash, r.hash as rolehash, 
main.stress as stressthreshold, r.stress as rolestressthreshold, main.caution, r.secondaryrole as secondaryroletype, 
main.secondaryrole as basesecondaryroletype, r.caution as rolecaution, r.fatigue as rolefatigue, main.basefatigue
from bbindividualbeast main
left join bbroles r on main.id = r.beastid
where main.hash = $1 or r.hash = $1