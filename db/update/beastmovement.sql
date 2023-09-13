update bbmovement
set beastid = $1, stroll = $2, walk = $3, jog = $4, run = $5, sprint = $6, type = $7, roleid = $9, allroles = $10, 
    strollstrength = $11, walkstrength = $12, jogstrength = $13, runstrength = $14, sprintstrength = $15, adjustment = $16
where id = $8