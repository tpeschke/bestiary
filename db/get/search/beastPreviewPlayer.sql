select id, name, hr, intro, patreon, rarity, subsystem, int, size, canplayerview, thumbnail from bbindividualbeast
where id = $1 and patreon < 3