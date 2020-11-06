select RANDOM() * Weight AS Weight, rank, name, beast.id as beastid, number from bbrankinfo ri
join bbrank r on r.id = ri.rankid
join bbindividualbeast beast on beast.id = ri.beastid
where ri.beastid = $1 and ri.rankid != $2
order by weight desc
limit 1;