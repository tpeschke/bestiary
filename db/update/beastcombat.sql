update bbcombatsquare
set beastid = $1, spd = $2, atk = $3, init = $4, def = $5, dr = $6, shield_dr = $7, measure = $8, damage = $9, parry = $10, 
fatigue = $11, weapon = $12, weapontype = $14, roleid = $15, isspecial = $16, hasspecialanddamage = $17, selectedweapon = $18, 
selectedarmor = $19, selectedshield = $20, addrolemods = $21, dontaddroledamage = $22
where id = $13