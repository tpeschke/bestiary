select l.*, count(b.*) from bblist l
left join bblistbeast b on b.listid = l.id
where userid = $1
group by l.id
order by name desc