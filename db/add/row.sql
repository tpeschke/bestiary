INSERT INTO bbtablerows (tableid, weight, value)
VALUES($2, $3, $4) 
ON CONFLICT (id)
DO 
   UPDATE SET tableid = $2, weight = $3, value = $4;