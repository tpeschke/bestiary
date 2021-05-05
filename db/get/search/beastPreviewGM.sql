select id, name, hr, intro, patreon, rarity from bbindividualbeast
where id = $1 and patreon < 20