select l.* from bbbeastlocation bl
join bblocations l on l.id = bl.artistid 
where beastid = $1