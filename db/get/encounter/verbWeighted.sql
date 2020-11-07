select verb from bbverbinfo vi
join bbverb v on v.id = vi.verbid
where beastid = $1
order by random()
limit 1;