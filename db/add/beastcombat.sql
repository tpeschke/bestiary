insert into bbcombatsquare (beastid, spd, atk, init, def, dr, shield_dr, measure, damage, parry, fatigue, weapon, weapontype, roleid, isspecial, hasspecialanddamage, selectedweapon, selectedarmor, selectedshield, addrolemods, dontaddroledamage, showmaxparry, damagetype) values 
($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
RETURNING *;