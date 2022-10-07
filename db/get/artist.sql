select ba.id, beastid, artist, tooltip, link from bbbeastartist ba
join bbartists a on a.id = ba.artistid
where ba.beastid = $1
order by artist