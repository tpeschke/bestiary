select id, name, patreon, canplayerview from bbindividualbeast 
where UPPER(name) like $1 ||'%'
order by name asc