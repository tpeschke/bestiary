select * from obpairs
where stringid = $1 and type = $2
order by index asc