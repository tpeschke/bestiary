select b.id, name, intro, patreon, rarity, size, canplayerview, thumbnail, mincombat, maxcombat, minsocial, maxsocial, minskill, maxskill from bbindividualbeast b
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
where b.id = $1 and patreon < 20 and (userid is null or userid = $2)