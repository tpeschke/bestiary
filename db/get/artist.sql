select ba.id, artistid, beastid, artist, tooltip, link, roleid from bbbeastartist ba
join bbartists a on a.id = ba.artistid
where ba.beastid = $1
order by roleid desc