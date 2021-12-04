(select id, name, type from obbase 
where UPPER(name) like $1 ||'%'
union 
select id, name, type from obchallenges 
where UPPER(name) like $1 ||'%')
order by name asc