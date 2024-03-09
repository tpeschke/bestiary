insert into usersAuth (username, auth0, tooltip)
values ($1, $2, '1')
RETURNING *;