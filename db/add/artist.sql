INSERT INTO bbbeastartist (beastid, artistid)
VALUES($1, $2) 
ON CONFLICT (beastid)
DO 
   UPDATE SET artistid = $2;