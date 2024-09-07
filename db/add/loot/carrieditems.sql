insert into bbcarrieditems (beastid, itemcategory, materialrarity, detailing, wear, chance, number) values 
($1, $2, $3, $4, $5, $6, $7)
returning *