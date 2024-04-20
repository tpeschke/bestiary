select DISTINCT(id) from bbindividualbeast
where UPPER(intro) like UPPER(( '%' || $1 || '%' ))
or
UPPER(habitat) like UPPER(( '%' || $1 || '%' ))
or
UPPER(ecology) like UPPER(( '%' || $1 || '%' ))