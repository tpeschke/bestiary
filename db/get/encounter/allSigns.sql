select * from bbsigns
where id not in (select signid from bbbeastsigns where beastid = $1)