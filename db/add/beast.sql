insert into bbindividualbeast (name, hr, intro, habitat, ecology, number_min, number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, subsystem, patreon, vitality, panic, broken) 
values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
RETURNING *;