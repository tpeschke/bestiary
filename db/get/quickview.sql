select main.id, main.name as name, r.id as roleid, r.name as role, sp_atk, sp_def, main.vitality, r.vitality as rolevitality, panic, main.hash, stress, patreon, canplayerview, stress, patreon from bbindividualbeast main
left join bbroles r on main.id = r.beastid
where main.hash = $1 or r.hash = $1