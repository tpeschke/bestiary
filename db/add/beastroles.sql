INSERT INTO bbroles (id, beastid, vitality, hash, name, role, attack, defense, secondaryrole, combatpoints, stress, panic, caution, 
socialrole, socialpoints, skillrole, skillpoints, socialsecondary, size, fatigue)
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) 
ON CONFLICT (id)
DO 
   UPDATE SET beastid = $2, vitality = $3, hash = $4, name = $5, role = $6, attack = $7, defense = $8, secondaryrole = $9, 
   combatpoints = $10, stress = $11, panic = $12, caution = $13, socialrole = $14, socialpoints = $15, skillrole = $16, skillpoints = $17, 
   socialsecondary = $18, size = $19, fatigue = $20