select id, name, hr, intro, patreon from bbindividualbeast
where id = $1 and patreon > 2 and patreon < 20