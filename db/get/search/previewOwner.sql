select b.id, b.name, intro, patreon, rarity, b.size, canplayerview, thumbnail, mincombat, maxcombat, minsocial, maxsocial, minskill, maxskill,
	CASE WHEN (sp_atk is not null or attack is not null) THEN true ELSE false END as hasCombatAttack, 
	CASE WHEN (sp_def is not null or defense is not null) THEN true ELSE false END as hasCombatDefense,
	CASE WHEN (atk_skill is not null or attack_skill is not null) THEN true ELSE false END as hasSkillAttack, 
	CASE WHEN (def_skill is not null or defense_skill is not null) THEN true ELSE false END as hasSkillDefense,
	CASE WHEN (atk_conf is not null or attack_conf is not null) THEN true ELSE false END as hasConfAttack, 
	CASE WHEN (def_conf is not null or defense_conf is not null) THEN true ELSE false END as hasConfDefense
from bbindividualbeast b
join (	select id, 	min(combatpoints) as mincombat, max(combatpoints) as maxcombat, 
					min(socialpoints) as minsocial, max(socialpoints) as maxsocial, 
					min(skillpoints) as minskill, max(skillpoints) as maxskill
		from bbindividualbeast b
		where b.socialpoints >= 0 and NOT EXISTS (	SELECT 1 
                   									FROM   bbroles r 
                  									WHERE  b.id = r.beastid
                  									group by b.id)
		group by b.id
		union
		select beastid as id, 	min(combatpoints) as mincombat, max(combatpoints) as maxcombat, 
								min(socialpoints) as minsocial, max(socialpoints) as maxsocial, 
								min(skillpoints) as minskill, max(skillpoints) as maxskill
		from bbroles r
		where r.socialpoints >= 0
		group by r.beastid
	) t on t.id = b.id
left join bbroles r on r.beastid = b.id
where b.id = $1 and userid is null