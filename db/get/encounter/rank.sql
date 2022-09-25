select beastid, weight, othertypechance, decayrate, lair, rank, ri.rankid as id, number from bbrankinfo ri
join bbrank r on r.id = ri.rankid
where beastid = $1
order by rank;