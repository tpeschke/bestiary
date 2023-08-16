INSERT INTO bbroles (id, beastid, vitality, hash, name, role, attack, defense, secondaryrole, combatpoints, stressstrength, panicstrength, cautionstrength, 
socialrole, socialpoints, skillrole, skillpoints, socialsecondary, size, fatiguestrength, largeweapons, mental, knockback, singledievitality)
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24) 
ON CONFLICT (id)
DO 
   UPDATE SET beastid = $2, vitality = $3, hash = $4, name = $5, role = $6, attack = $7, defense = $8, secondaryrole = $9, 
   combatpoints = $10, stressstrength = $11, panicstrength = $12, cautionstrength = $13, socialrole = $14, socialpoints = $15, skillrole = $16, skillpoints = $17, 
   socialsecondary = $18, size = $19, fatiguestrength = $20, largeweapons = $21, mental = $22, knockback = $23, singledievitality = $24