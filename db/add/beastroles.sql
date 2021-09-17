INSERT INTO bbroles (id, beastid, vitality, hash, name)
VALUES($1, $2, $3, $4, $5) 
ON CONFLICT (id)
DO 
   UPDATE SET beastid = $2, vitality = $3, hash = $4, name = $5