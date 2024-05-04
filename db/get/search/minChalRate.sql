select id from bbindividualbeast b
where b.skillpoints >= $1 and NOT EXISTS (	SELECT 1 
                   							FROM   bbroles r 
                  							WHERE  b.id = r.beastid)
union
select beastid as id from bbroles r
where r.skillpoints >= $1