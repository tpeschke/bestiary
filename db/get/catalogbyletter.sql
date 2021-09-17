select id, name, patreon, canplayerview, thumbnail, hash from bbindividualbeast 
where UPPER(name) like $1 ||'%'
order by name asc