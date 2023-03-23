select c.name, b.* from bbskillbeast b
join obchallenges c on c.id = b.challengeid 
where beastid = $1