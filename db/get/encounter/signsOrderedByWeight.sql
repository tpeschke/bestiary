select bs.id, beastid, signid, weight, sign from bbbeastsigns bs
join bbsigns t on t.id = bs.signid
where bs.beastid = $1
order by weight desc;