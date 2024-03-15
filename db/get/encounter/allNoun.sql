select min(id) as id, noun from bbnoun
where noun in (SELECT DISTINCT noun FROM bbnoun b) 
and id not in (select nounid from bbnouninfo where beastid = $1)
group by noun
order by noun