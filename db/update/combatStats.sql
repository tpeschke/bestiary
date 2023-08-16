update bbcombatstats
set beastid = $2, roleid = $3, piercingweapons = $4, slashingweapons = $5, crushingweapons = $6, weaponsmallslashing = $7,
              weaponsmallcrushing = $8, weaponsmallpiercing = $9, andslashing = $10, andcrushing = $11, flanks = $12, 
              rangeddefence = $13, alldefense = $14, allaround = $15, armorandshields = $16,
              unarmored = $17, attack = $18, isspecial = $19, eua = $20, addsizemod = $21, weapon = $22, shield = $23, 
              armor = $24, weaponname = $25, rangeddefense = $26, initiative = $27, measure = $28, recovery = $29, showonlydefenses = $30,
              weapontype = $31, rangedistance = $32
where id = $1