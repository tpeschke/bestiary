insert into bbindividualbeast (name, hr, intro, habitat, ecology, number_min, number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, subsystem, patreon, vitality, panic, stress, hash, lootnotes, traitlimit, devotionlimit, flawlimit, passionlimit, plural, thumbnail, rarity, caution, role, combatpoints, socialrole, socialpoints, secondaryrole, skillrole, skillpoints, basefatigue) 
values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37)
RETURNING *;