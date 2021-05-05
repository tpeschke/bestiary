select id, name, patreon, canplayerview, thumbnail from bbindividualbeast 
where UPPER(name) like $1 ||'%'
order by name asc