INSERT INTO bbroles (id, beastid, vitality, hash, name, role, attack, defense, secondaryrole)
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
ON CONFLICT (id)
DO 
   UPDATE SET beastid = $2, vitality = $3, hash = $4, name = $5, role = $6, attack = $7, defense = $8, secondaryrole = $9