select distinct(b.id) from bbindividualbeast b
left join bbroles b2 on b2.beastid = b.id
where UPPER(b.socialrole) like UPPER(( '%' || $1 || '%' )) or UPPER(b.socialsecondary) like UPPER(( '%' || $1 || '%' ))
or UPPER(b2.socialrole) like UPPER(( '%' || $1 || '%' )) or UPPER(b2.socialsecondary) like UPPER(( '%' || $1 || '%' ));