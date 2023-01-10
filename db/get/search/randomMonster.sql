select id from bbindividualbeast b 
where patreon <= $1
order by Random()
limit 1