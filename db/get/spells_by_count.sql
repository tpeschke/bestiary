select count(spell), spell from bbreagents b
group by spell
order by count asc