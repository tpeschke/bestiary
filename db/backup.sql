create table bbindividualbeast (
    id serial primary key,
    name varchar(40),
    hr int,
    intro text,
    habitat text,
    ecology text,
    number_min int,
    number_max int,
    senses varchar(40),
    diet varchar(40),
    meta text,
    sp_atk text,
    sp_def text,
    tactics text,
    size varchar(1),
    subsystem int,
    patreon int,
    vitality varchar(40),
    panic int,
    broken int,
    canplayerview BOOLEAN default false
)

create table bbtypelist (
    id serial primary key,
    type varchar(40)
);

insert into bbtypelist (type) values 
('Demon'),('Undead, Corporeal'),('Undead, Incorporeal'),('Elemental'),('Natural Creature'),('Weird Creature'),('Humanoid'),('Intelligent Evil'),('Goblinoid')

create table bbenvironlist (
    id serial primary key,
    environ varchar(40)
);

insert into bbenvironlist (environ) values 
('Dungeon/Ruins'),('Wilderness'),('Forest'),('Castle'),('Cave/Underground'),('Mountain'),('Plains'),('Swamp'),('Urban'),('Ship'),('Coastal'),('Aquatic'),('Other'),('Desert'),('Island'),('Jungle'),('Sewer'),('House')

create table bbbeasttype (
    id serial primary key,
    beastid int,
    typeid int
);

create table bbbeasteviron (
    id serial primary key,
    beastid int,
    environid int
);

create table bbcombatsquare (
    id serial primary key,
    beastid int,
    spd int,
    atk int,
    init int,
    def varchar(10),
    dr varhcar(10),
    shield_dr varchar(10),
    measure int,
    damage varchar(25),
    parry int,
    encumb int,
    weapontype varchar(1) default 'm'
)

create table bbranges (
    id serial primary key,
    weaponid int,
    zero int,
    two int,
    four int,
    six int,
    eight int
);

create table bbconflict (
    id serial primary key,
    trait varchar(100),
    value varchar(50),
    beastid int
);

create table bbskills (
    id serial primary key,
    beastid int,
    skill varchar(25),
    rank varchar(10)
)

create table bbmovement (
    id serial primary key,
    beastid int,
    stroll varchar(40),
    walk varchar(40),
    jog varchar(40),
    run varchar(40),
    sprint varchar(40),
    type varchar(40)
)

create table bbbeastusernotes (
    id serial primary key,
    beastid int,
    userid int,
    notes text
)

create table bbvariants (
    id serial primary key,
    beastid int,
    variantid int
)

create table bbloot (
    id serial primary key,
    beastid int,
    loot varchar(150),
    price varchar(15)
)

create table bbreagents (
    id serial primary key,
    beastid int,
    name varchar(150),
    spell varchar(150),
    difficulty varchar(15)
)

create table bbtemperament (
    id serial primary key,
    temperament varchar(100),
    tooltip varchar(150)
);

create table bbbeasttemperament (
    id serial primary key,
    beastid int,
    temperamentid int
);


create table bbrank (
    id serial primary key,
    rank varchar(150)
);

insert into bbrank (rank) values ('War-Chief'), ('Shaman'), ('Weirdman');

create table bbrankinfo (
    id serial primary key,
    rankid int,
    beastid int,
    weight int,
    othertypechance int,
    decayrate int,
    lair varchar(100)
);

create table bbcomplications (
    id serial primary key,
    complication varchar(250)
);

insert into bbcomplications (complication) values
('Rival'),('Wounded'),('Trapped'),('Insane'),('Lost'),('Diseased'),('Time Limit'),('Back Up Coming')
,('Powerful Weird-Adept or Servant'),('Powerful Artifact or Relic'),('In-Fighting'),('Roll An Additional Time');

create table bbverb (
    id serial primary key,
    verb varchar(200)
);

create table bbverbinfo (
    id serial primary key,
    beastid int,
    verbid int
)

create table bbnoun (
    id serial primary key,
    noun varchar(250)
);

create table bbnouninfo (
    id serial primary key,
    nounid int,
    beastid int
)

create table bbbattlefield (
    id serial primary key,
    battlefield varchar(250)
);

insert into bbbattlefield (battlefield) values 
('Divided Company'), ('Divided the Company From the Enemy')
, ('Active hazard'), ('Differing Elevation'), ('In Fortified Position')
, ('Cramped Quarters'), ('Beyond Ranged Weaponry'), ('Both Parties Surprised')
, ('Ambush (for Enemies)'), ('Ambush (for Company)'), ('Bad Weather')
, ('More Powerful Force Shows Up During')

create table bblairlootbasic (
	id serial primary key,
	beastid int,
	copper varchar(2),
	silver varchar(2),
	gold varchar(2),
	relic varchar(2),
	enchanted varchar(2),
	potion varchar(2)
)

create table bblairlootequipment (
	id serial primary key,
	beastid int,
	number varchar(2),
	value varchar(2)
)

create table bblairloottraited (
	id serial primary key,
	beastid int,
	chanceTable varchar(2),
	value varchar(2)
)

create table bblairlootscrolls (
	id serial primary key,
	beastid int,
	number varchar(2),
	power varchar(2)
)
create table bblairlootalms (
	id serial primary key,
	beastid int,
	number varchar(2),
	favor varchar(2)
)

create table bbroles (
    id varchar(15) primary key,
    beastid int,
    vitality varchar(50),
    hash varchar(50),
    name varchar(50)
);

create table bbspells (
    id varchar(15) primary key,
    beastid int,
    name varchar(50),
    origin varchar(50),
    range varchar(50),
    shape varchar(50),
    interval varchar(50),
    effect varchar(500)
);

create table bbcasting (
    id serial primary key,
    beastid int,
    augur boolean,
    wild boolean,
    vancian boolean,
    manifesting boolean,
    commanding boolean,
    bloodpact boolean,
    spellnumberdie varchar(50)
);

create table obbase (
    id varchar(50) primary key,
    complicationsingle varchar(500),
    difficulty varchar(500),
    failure  varchar(500),
    information  varchar(500),
    name varchar(500),
    notes varchar(500),
    success varchar(500),
    threshold varchar(500),
    time varchar(500),
    type varchar(25),
    stringid varchar(50) unique
);

create table obpairs (
    id serial primary key,
    name varchar(500),
    body varchar(500),
    type varchar(25),
    index int,
    stringid varchar(50)
);

create table obcomplications (
    id serial primary key,
    name varchar(500),
    body varchar(500),
    index int,
    stringid varchar(50)
);

create table obchallenges (
    id serial primary key unique,
    name varchar(500),
    flowchart text,
    type varchar(25),
    notes varchar(1000)
);