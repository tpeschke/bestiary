insert into bbcombatsquare (beastid, spd, atk, init, def, dr, shield_dr, measure, damage, parry, encumb, weapon, weapontype) values 
($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
RETURNING *;