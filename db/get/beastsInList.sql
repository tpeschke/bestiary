select l.id, beastid, listid, name,
	CASE WHEN l.rarity is null THEN b.rarity ELSE l.rarity END as rarity
from bblistbeast l
left join bbindividualbeast b on b.id = l.beastid 
where listid = $1
order by b.name asc