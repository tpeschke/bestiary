select b.id, b.name from obchallenges b
where UPPER(name) like  UPPER(( '%' || $1 || '%' ))
limit 20;