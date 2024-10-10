select bl.id, locationid, beastid, location, link from bbbeastlocation bl
join bblocations l on l.id = bl.locationid
where bl.beastid = $1
order by location