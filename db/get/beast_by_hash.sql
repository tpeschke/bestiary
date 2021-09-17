select main.id, r.id as roleid, main.name, r.name as role, r.vitality as roleVitality, main.vitality, panic, stress as stressthreshold from bbindividualbeast main
left join bbroles r on main.id = r.beastid
where main.hash = $1 or r.hash =$1;