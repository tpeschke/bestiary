select distinct(b.id) from bbindividualbeast b
left join bbroles b2 on b2.beastid = b.id
where UPPER(b.skillrole) like UPPER(( '%' || $1 || '%' )) or UPPER(b2.skillrole) like UPPER(( '%' || $1 || '%' ))