select * from bbrank
where id in (select rankid from bbrankinfo where beastid = $1)