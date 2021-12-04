select id from obbase
where UPPER(name) like UPPER(( '%' || $1 || '%' ))