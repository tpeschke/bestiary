select bbbeasttype.id as id, typeid, description from bbbeasttype
join bbtypelist on bbtypelist.id = bbbeasttype.typeid
 where beastid = $1