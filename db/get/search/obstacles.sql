select b.id, b.name from obbase b
where UPPER(name) like  UPPER(( '%' || $1 || '%' ))
limit 20;