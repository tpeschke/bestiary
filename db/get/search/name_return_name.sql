select b.id, b.name from bbindividualbeast b
join (select id, concat_ws(' ', parts[2], parts[1]) as searchablename
		from (
  		select id, string_to_array(name, ', ') as parts
  		from bbindividualbeast
	) t) as t on t.id = b.id
where UPPER(name) like  UPPER(( '%' || $1 || '%' )) or UPPER(searchablename) like  UPPER(( '%' || $1 || '%' ))
limit 20;