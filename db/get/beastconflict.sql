select * from ( 
(select id, value, beastid, type, socialroleid, allroles, trait from bbconflict  
where beastid = $1 and type != 'h' and type != 't' and type != 'c')
union 
(select id, value, beastid, type, socialroleid, allroles,
REPLACE(trait, 'Any', (SELECT conviction FROM srdconvictions s 
    ORDER BY random()+bbconflict.id LIMIT 1)) as trait
from bbconflict  
where beastid = $1 and (type = 't' or type = 'c'))
union
(select id, value, beastid, type, socialroleid, allroles,
REPLACE(trait, 'Any', (SELECT description FROM srddescriptions s 
    ORDER BY random()+bbconflict.id LIMIT 1)) as trait
from bbconflict  
where beastid = $1 and type = 'h')
) t
order by random()