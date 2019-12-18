select id from bbindividualbeast
where UPPER(name) like UPPER(( '%' || $1 || '%' ))