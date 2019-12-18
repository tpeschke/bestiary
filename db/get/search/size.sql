select id from bbindividualbeast
where UPPER(size) like UPPER(( '%' || $1 || '%' ))