select RANDOM() * Weight AS Weight, temperament, tooltip from bbbeasttemperament bt
join bbtemperament t on t.id = bt.temperamentid
where bt.beastid = $1
order by weight desc
limit 1