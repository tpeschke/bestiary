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
    caution int default 0,
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

create table bbbattlefieldpattern (
    id serial primary key,
    pattern varchar(250)
);

insert into bbbattlefieldpattern (pattern) values 
('Open Field'), ('Divide')
, ('Danger Wall'), ('Pillar'), ('Guardian')
, ('Pincer'), ('Funnel'), ('Horseshoe')
, ('Long-Path'), ('Alley'), ('Up-Hill')
, ('King of the Hill')

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

create table bbskillbeast (
	id serial primary key unique,
	beastid int,
	challengeid int
)

create table bbsigns (
    id serial primary key,
    sign varchar(250)
);

create table bbbeastsigns (
    id serial primary key,
    beastid int,
    signid int,
    weight int
);

create table bbartists (
    id serial primary key,
    artist varchar(500),
    tooltip varchar(500),
    link varchar(500)
);

create table bbbeastartist (
    id serial primary key,
    beastid int,
    artistid int
);

create table bblocations (
    id serial primary key,
    location varchar(500),
    link varchar(500)
);

create table bbbeastlocation (
    id serial primary key,
    beastid int,
    locationid int
);

create table bbroleweights (
    id serial primary key,
    beastid int,
    labelid int,
    roleid int,
    role varchar(150)
    weight int
)

create table bbencounternumbers (
    id serial primary key,
    beastid int,
    numbers varchar(150),
    miles varchar(150)
)

create table bbencounterlabels (
    id serial primary key,
    beastid int,
    label varchar(150),
    weight int
)

create table bbbeastsingleobstacle (
    id serial primary key,
    beastid int,
    obstacleid int,
    notes varchar(150)
)

create table bbcarriedlootbasic (
	id serial primary key,
	beastid int,
	copper varchar(2),
	silver varchar(2),
	gold varchar(2),
	relic varchar(2),
	enchanted varchar(2),
	potion varchar(2)
);

create table bbcarriedlootequipment (
	id serial primary key,
	beastid int,
	number varchar(2),
	value varchar(2)
);

create table bbcarriedloottraited (
	id serial primary key,
	beastid int,
	chanceTable varchar(2),
	value varchar(2)
);

create table bbcarriedlootscrolls (
	id serial primary key,
	beastid int,
	number varchar(2),
	power varchar(2)
);

create table bbcarriedlootalms (
	id serial primary key,
	beastid int,
	number varchar(2),
	favor varchar(2)
);

create table bbfolklore (
	id serial primary key,
	beastid int,
	belief varchar(500),
	truth varchar(500)
);

create table bbrandomdevotion (
	id serial primary key,
	noun varchar(150),
	verb varchar(150)
);

create table bbcombatstats (
    id serial primary key,
    beastid int,
    roleid varchar(150), 
    weapontype varchar(20), 
    piercingweapons varchar(20), 
    slashingweapons varchar(20), 
    crushingweapons varchar(20), 
    weaponsmallslashing varchar(20),
    weaponsmallcrushing varchar(20), 
    weaponsmallpiercing varchar(20), 
    andslashing varchar(20), 
    andcrushing varchar(20), 
    flanks varchar(20), 
    rangeddefence varchar(20), 
    all varchar(20), 
    allaround varchar(20), 
    armorandshields varchar(20),
    unarmored varchar(20), 
    attack varchar(20), 
    isspecial varchar(20), 
    eua boolean, 
    addsizemod boolean, 
    weapon varchar(150), 
    shield varchar(150), 
    armor varchar(150), 
    weaponname varchar(150), 
    rangeddefense varchar(20)
)

create table bbtablebeast (
    id serial primary key,
    beastid int,
    tableid int
)

create table bbtableinfo (
    id serial primary key,
    label varchar(250),
    section varchar(10)
)

create table bbtablerows (
    id serial primary key,
    tableid int,
    weight int,
    value varchar(250)
)

create table bbclimate (
    id serial primary key,
    code varchar(10),
    climate varchar(1000),
    examples varchar(1000)
);

create table bbbeastclimate (
    id serial primary key,
	beastid int,
	climateid int
)

create table bblist (
    id serial primary key,
    userid int,
    name varchar(500)
);

create table bblistbeast (
    id serial primary key,
    beastid int,
    listid int,
    rarity int
);

create table bbcarrieditems (
    id serial primary key,
    beastid int,
    itemcategory int,
    materialrarity varchar(1),
    detailing varchar(1),
    wear varchar(5),
    chance int,
    number int
);

create table bblairitems (
    id serial primary key,
    beastid int,
    itemcategory int,
    materialrarity varchar(1),
    detailing varchar(1),
    wear varchar(5),
    chance int,
    number int
);

create table bbscenarios (
    id serial primary key,
    beastid int,
    scenario varchar(500)
); 

create table bbarchetypes (
    id serial primary key,
    archetype varchar(500)
); 

insert into bbarchetypes (archetype)
values ('Absentminded genius who’s let his obsession overshadow everything else'),
('Action hero in spirit'),
('Lively, skilled, but stoic in the face of danger, soldier'),
('Assertive and overbearing never been wrong about anything'),
('Frustrated but weak, reactionary and morally demanding'),
('Always feels welcome to everything despite never asking, confident for no reason'),
('Cynical but softhearted hero'),
('Pampered, unaware twit who is, nonetheless, good-natured and affable '),
('Yourself'),
('Roguish, good-looking womanizer or manizer'),
('Detached theatrical who is thinks his wit makes him invulnerable'),
('Old, brazen, and domineering person'),
('Hipster'),
('Bitter war veteran'),
('Caring sidekick with keen insights'),
('Blind seer who is never believed'),
('A braggart who can’t back up his words'),
('Bully who just loves being cruel'),
('Dark, glooming, and brooding outcast'),
('Unhinged but benevolent hermit'),
('Con artist looking for his next score'),
('Cowardly salt-of-the-earth'),
('Scrappy underdog who always chooses to fight'),
('Cunning, career criminal who looks the part'),
('Cruel witch-like person'),
('Curmudgeon with a heart of gold'),
('Permanent damsel/gallant in distress'),
('A good-looking fop, tapped into the latest trends and fashions'),
('Dark woman/man, doomed in some way'),
('Mysterious, inscrutable, but beautiful, aristocratic'),
('A wounded devil who would defile the land'),
('Over-the-top dastardly whiplash'),
('Dark shadow of one of the characters'),
('Strong, deceitful, and mysterious spider'),
('Strict but caring commander, driving their underlings to be their best via cruelty'),
('Attractive, young, and naive'),
('Unshaven, unwashed, and impulsive bandit'),
('The old and all-knowing sage'),
('Malevolent clown'),
('Fat, vain, and hedonistic knight who loves nothing more than himself'),
('Unbending, young idealist'),
('Long-suffering but hard-bitten partner'),
('Loud, uncontrollable buffoon'),
('Traitorous, cunning beauty out for money'),
('Scheming valet and social climber; good humored but unscrupulous'),
('Survival above all else'),
('Foil to one of the characters'),
('Diogenes'),
('Someone running/hiding from a dark past that they don’t regret'),
('Attractive trophy of a much powerful person'),
('Obsessive and peculiar person, expert in something unfashionable, boring, and/or overly philosophical'),
('Good-hearted giant'),
('Gentleman thief, using charm and manners to steal'),
('Wholesome young, untouched by the cares of the world'),
('Haughty lord/lady; flamboyant and well-mannered to the extreme'),
('Youth who wants nothing more than to prove how tough they are; really into counter culture'),
('Mistreated grotesque with a soft heart'),
('True believing zealot'),
('Unattached traveler and occultist with ancient knowledge'),
('Bitter and cynical soldier who’s seen too much death'),
('Nimble, astute, and adapt sidekick'),
('Tough-talking hawk'),
('Intelligent detective, aloof and amoral to an extent that it allows them to satisfy their curiosity'),
('Down-on-their-luck criminal with a good heart'),
('Romantic, optimistic about life and people'),
('Reckless adrenaline junkie'),
('Pint-sized klutz with confidence ten times his size'),
('Pouting, complaining, cajoling youth'),
('Overbearing, over protecting, loud, nagging who’s weapon is guilt'),
('Raised by wolves'),
('Bumbling, incompetent man/woman of the law'),
('Pining, idealistic knight gallant'),
('Kind-hearted person, hardened and on guard due to past wounds'),
('Thrust into a position they never wanted but are skilled at'),
('Person unable to connect with people, withdrawn but benign'),
('Star-crossed, but doomed, lover'),
('Machiavel prince'),
('Hubristic, amoral seeker for things that man wasn’t meant to know'),
('Aloof, uncivilized shaman, troubled by the dark inside'),
('Unhappy outsider, happy to comment on things that make them unhappy'),
('Hot-blooded comic relief'),
('Sturdy, homely servant who does the unthanked work'),
('Serial nonconformist without friend or ally'),
('Unabashedly girlish, quirky, and full of dreams'),
('Popular, attractive, and totally in control king/queen'),
('Permanent middle-child, bitter about their station in life'),
('Cowardly soldier who brags about valorous past'),
('Wicked, anti-authoritarian hero, who believes the rules never apply to them'),
('Old, wealthy miser, successful in what they do to the misery of others'),
('Childish adult, submissive to a parent figure'),
('Battle-axe that only has disapproval for others'),
('Indefatigable, competent antagonist'),
('Poor but agreeable and moral nice guy/girl'),
('Honorable antagonist bound by code of morals and reason'),
('Rogue with a heart of gold'),
('Effeminate, whiny, and entitled, easily irritated'),
('Gluttonous, aggressive coward; kills without a second thought'),
('Arrogant yuppie'),
('Warrior prince/princess; contrast of hyper femininity and hyper masculinity'),
('Embittered, amoral ex-celebrity'),
('Unrepentant punk who is hyper-competent'),
('Impressionable, naïve recruit adapting to their new situation'),
('Jolly, fun-loving hillbilly with no fear'),
('Enabling people pleaser'),
('Classic criminal with funny name and rough exterior who is ride or die'),
('Booksmart, modest, and naïve teacher '),
('Full of rage, threats, obsessions, and gullibility'),
('Spirited, friendly hero, out to prove their strength'),
('Nagging, scolding, and violent in a petty way'),
('Impish sidekicks who’re a bad influence'),
('Corrupt lawyer with very little care for the spirit of the law'),
('Vocal hypocrite, happy to sentence others to redirect from their own crimes'),
('Calm, collected mastermind hiding an inner rage'),
('Light-hearted gossip trying to block others from what they want by manipulation'),
('Sold their soul to their artistic vision which is bohemian and doesn’t pay well'),
('Overly serious, obvious and unaffected by anything going around them'),
('Good hearted defender of their way of life'),
('Totally chill person who is happy-go-lucky'),
('Skilled fighter and acrobat, full of joy, noise, and chivalry'),
('One who is sent to commit the worst crimes by their boss'),
('Puckish tom-boy or young man'),
('Addicted, misunderstood artist, full of narcissism and frustration'),
('Good hearted addict'),
('Hero with a huge flaw, dooming them to failure'),
('Person torn between two worlds'),
('Theatrical bad boy'),
('Stoic, coy person with a dark sense of humor'),
('Old person who hates anything younger than them'),
('Flaw of one of the characters made incarnate'),
('Soldier haunted by the violence and death they’ve seen so that they’re fragile and unstable'),
('Known for ignorance and stupidity but brave, sweet, and wise'),
('Educated, haughty member of the intelligentsia with a good sense of humor'),
('Holy person with obvious moral weakness, encouraging others, earnestly, to be better'),
('Awkward, well-meaning square with no social graces'),
('Big-game hunter and bravo'),
('Weak-willed, mild-mannered sidekick; the target of derision by those around them'),
('Old sage who quietly mentors'),
('Rural, coarse-mannered country bumpkin'),
('Naïve-looking, young person who watches and knows more than they let on'),
('Career-focused busy-body with a love of fine things'),
('Astute, cunning servant')

create table bbmonsterarchetypes (
    id serial primary key,
    archetype varchar(500)
); 

insert into bbmonsterarchetypes (archetype)
values ('Abusive Authority Figure'),('Unapologetically Hedonist'),('So Insane, They’re Sane'),('Scheming Weasel'),('Arrogantly Honest but Lying to Themselves'),('Vain about Looks and Intelligence'),('Mad Inventor'),('Addicted to Corruption'),('Willfully and Compulsively Defiant'),('Unthinking Brute'),('Eerily in Control'),('Minion with no Backbone'),('Heartless Mercenary'),('Ignorant and Proud of It'),('Angerly Fearful'),('Unquestioning Zealot'),('Wishes for Everyone to be as Miserable as Them'),('Believes They’re Above Good & Evil'),('Cordially Sociopathic'),('Aggressively Lazy'),('Bucket Crab Mentality'),('Ambitious with no Bounds'),('Uses Sympathy as a Shield'),('Uncontrolled, Uncontrollable Addict'),('Happy to Watch the World Burn'),('Convinced of Elitist Birthright'),('Compulsive Liar'),('Covetous of All They Don’t Have'),('Believes it is Necessity'),('Believes They Have Moral High Ground'),('Theatrically Mustache-Twirling'),('Compulsive Boundary Pusher'),('Munchausen Syndrome with Their Own Poor Choices'),('Delights in Causing Others to Fail'),('Loud and Militant Jingoist'),('Witch-hunting Hypocrite'),('Two-Faced Backbiter'),('Imperial Supremist'),('Scheming Under Miner'),('Reveals in Destruction'),('Negatively Impulsive'),('Social Darwinist and Xenophobe'),('Hardliner with Twisted Warrior Code'),('Ends Always Justify Means'),('Power-Hungry Defiler'),('Dark Messiah'),('Profits for a Bad Situation'),('Hyper Controlling Solipsist'),('Unapologetically Cruel'),('Tribe-Based Morality')