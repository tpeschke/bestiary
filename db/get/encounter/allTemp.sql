select * from bbtemperament
where id not in (select temperamentid from bbbeasttemperament where beastid = $1)