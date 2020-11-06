select RANDOM() * Weight AS Weight, rank, othertypechance, decayrate, lair, rankid, number from bbrankinfo ri
join bbrank r on r.id = ri.rankid
where ri.beastid = $1
order by weight desc
limit 1;