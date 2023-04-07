update bbspells
set name = $2, origin = $3, shape = $4, range = $5, interval = $6, effect = $7, allroles = $9, roleid = $10, resist = $11
where id = $1 and beastid = $8