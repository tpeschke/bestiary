select * from bbtableinfo
where id in (select tableid as id from bbtablebeast
              where beastid = $1)
order by label