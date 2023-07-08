insert into bbcasting (augur, wild, vancian, spellnumberdie, manifesting, commanding, bloodpact, defaulttype, beastid)
values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
on conflict (beastid)
do 
    update set augur = $1, wild = $2, vancian = $3, spellnumberdie = $4, manifesting = $5, commanding = $6, bloodpact = $7, defaulttype = $8