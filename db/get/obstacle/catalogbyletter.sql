select id, name from obbase 
where UPPER(name) like $1 ||'%'
order by name asc