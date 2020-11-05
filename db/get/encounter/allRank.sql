select * from bbrank
where id not in (select rankid from bbrankinfo where beastid = $1)