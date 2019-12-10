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
    broken int
)

create table bbtypelist (
    id serial primary key,
    type varchar(40)
);

insert into bbtypelist (type) values 
('Demon'),('Undead, Corporeal'),('Undead, Spirit'),('Elemental'),('Natural Creature'),('Magical Creature'),('Humanoid'),('Intelligent Evil'),('Goblinoid')

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
    encumb int
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