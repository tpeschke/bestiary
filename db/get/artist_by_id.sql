select a.* from bbbeastartist ba
join bbartists a on a.id = ba.artistid 
where beastid = $1