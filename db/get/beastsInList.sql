select l.id, beastid, listid, name,
	CASE WHEN l.rarity is null THEN b.rarity ELSE l.rarity END as rarity
from bblistbeast l
left join bbindividualbeast b on b.id = l.beastid 
order by b.name desc
where listid = $1;