select DISTINCT(id) from bbindividualbeast
where UPPER(intro) like UPPER(( '%' || $1 || '%' ))
or
where UPPER(habitat) like UPPER(( '%' || $1 || '%' ))
or
where UPPER(ecology) like UPPER(( '%' || $1 || '%' ))