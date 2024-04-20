select t.id, name, intro, patreon, rarity, size, canplayerview, thumbnail, t.combatpoints, t.socialpoints, t.skillpoints from bbindividualbeast b
join (select avg(combatpoints) as combatpoints, avg(socialpoints) as socialpoints, avg(skillpoints) as skillpoints, $1 as id from 
(select combatpoints, socialpoints, skillpoints from bbindividualbeast b where b.id = $1
union all
select combatpoints, socialpoints, skillpoints from bbroles where beastid = $1) x) t
on t.id = b.id
where t.id = $1 and canplayerview = true and userid is null