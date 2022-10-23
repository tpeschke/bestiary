select id, value, beastid, type, socialroleid, allroles,
REPLACE(trait, 'Any',  (SELECT conviction FROM srdconvictions s 
    ORDER BY random()+bbconflict.id LIMIT 1)) as trait
from bbconflict  
where beastid = $1 
order by random()