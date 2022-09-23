WITH added_row_number AS (
  SELECT
    id as signid, sign,
    ROW_NUMBER() OVER(PARTITION BY sign ORDER BY id DESC) AS row_number
  FROM bbsigns
  where id not in (select signid from bbbeastsigns where beastid = $1)
)
SELECT
  *
FROM added_row_number
WHERE row_number = 1;