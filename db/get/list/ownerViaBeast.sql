select userid from bblist b 
where id = (select listid from bblistbeast b
			where id = $1)