select verb || ' ' || noun as trait from 
	(select 1 as joinid, id, noun from bbrandomdevotion b
	where verb is not null
	order by random()
	limit 1) n
join (select 1 as joinid, id, verb from bbrandomdevotion b
	  where verb is not null
	  order by random()
	  limit 1) v on v.joinid = n.joinid