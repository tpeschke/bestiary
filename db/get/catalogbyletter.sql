select id, name, patreon from bbindividualbeast 
where UPPER(name) like $1 ||'%'
order by name asc