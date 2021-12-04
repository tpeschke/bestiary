select * from obchallenges o 
where UPPER(name) like UPPER(( '%' || $1 || '%' )) or UPPER(flowchart) like UPPER(( '%' || $1 || '%' )) 
or UPPER(notes) like UPPER(( '%' || $1 || '%' ))
order by o.name asc