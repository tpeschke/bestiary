select min(id) as id, verb from bbverb b
where verb in (SELECT DISTINCT verb FROM bbverb)
and id not in (select verbid from bbverbinfo where beastid = $1)
group by verb
order by verb;