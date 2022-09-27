select distinct(b.id) from bbindividualbeast b
left join bbroles b2 on b2.beastid = b.id
where UPPER(b.role) like UPPER(( '%' || $1 || '%' )) or UPPER(b.secondaryrole) like UPPER(( '%' || $1 || '%' ))
or UPPER(b2.role) like UPPER(( '%' || $1 || '%' )) or UPPER(b2.secondaryrole) like UPPER(( '%' || $1 || '%' ));