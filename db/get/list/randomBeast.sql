select l.id, beastid, listid, name,
	RANDOM() * (CASE WHEN l.rarity is null THEN b.rarity ELSE l.rarity END) as weight
from bblistbeast l
left join bbindividualbeast b on b.id = l.beastid 
where listid = (select id as listid from bblist l
				where url = $1)
order by weight desc