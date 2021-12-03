select o.* from obbase o
join obpairs p on p.stringid = o.stringid
join obcomplications c on c.stringid = o.stringid
where UPPER(complicationsingle) like UPPER(( '%' || $1 || '%' )) or UPPER(difficulty)  like UPPER(( '%' || $1 || '%' )) 
or UPPER(failure) like UPPER(( '%' || $1 || '%' )) or UPPER(information) like UPPER(( '%' || $1 || '%' )) 
or UPPER(o.name) like UPPER(( '%' || $1 || '%' )) or UPPER(notes) like UPPER(( '%' || $1 || '%' )) 
or UPPER(success) like UPPER(( '%' || $1 || '%' ))or UPPER(threshold) like UPPER(( '%' || $1 || '%' )) 
or time like UPPER(( '%' || $1 || '%' )) or UPPER(p.name) like UPPER(( '%' || $1 || '%' ))
or UPPER(p.body) like UPPER(( '%' || $1 || '%' )) or UPPER(c.name) like UPPER(( '%' || $1 || '%' ))
or UPPER(c.body) like UPPER(( '%' || $1 || '%' ))
order by o.name asc;