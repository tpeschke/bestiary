INSERT INTO bbroles (id, beastid, vitality, hash, name, role, attack, defense, secondaryrole, combatpoints, stressstrength, 
panicstrength, cautionstrength, socialrole, socialpoints, skillrole, skillpoints, socialsecondary, size, fatiguestrength, 
largeweapons, mental, knockback, singledievitality, noknockback, rollundertrauma, attack_skill, defense_skill, attack_conf, 
defense_conf, isIncorporeal, weaponbreakagevitality )
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26,
$27, $28, $29, $30, $31, $32) 
ON CONFLICT (id)
DO 
   UPDATE SET beastid = $2, vitality = $3, hash = $4, name = $5, role = $6, attack = $7, defense = $8, secondaryrole = $9, 
   combatpoints = $10, stressstrength = $11, panicstrength = $12, cautionstrength = $13, socialrole = $14, socialpoints = $15, 
   skillrole = $16, skillpoints = $17, socialsecondary = $18, size = $19, fatiguestrength = $20, largeweapons = $21, mental = $22, 
   knockback = $23, singledievitality = $24, noknockback = $25, rollundertrauma = $26, attack_skill = $27, defense_skill = $28, 
   attack_conf = $29, defense_conf = $30, isIncorporeal = $31, weaponbreakagevitality = $32