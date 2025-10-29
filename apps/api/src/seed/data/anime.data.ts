import {
	type IAnime,
	MoodEnum,
	Anime,
	AnimeSchema,
	Quote,
	QuoteSchema,
} from '@anime';

export const animeModels = [
	{ name: Anime.name, schema: AnimeSchema },
	{ name: Quote.name, schema: QuoteSchema },
];

export const animeDB: IAnime[] = [
	{
		title: 'The Promised Neverland',
		protagonist: 'Emma',
		universe: 'Grace Field House (obviously)',
		rating: 8.1,
		quotes: [
			{
				character: 'Emma',
				quote: "If there's no path, then we'll make one.",
				mood: MoodEnum.Inspirational,
			},
			{
				character: 'Norman',
				quote: "If we don't try, then there's no point in living.",
				mood: MoodEnum.Motivational,
			},
			{
				character: 'Ray',
				quote: "There's no such thing as a future for us. But... I won't give up.",
				mood: MoodEnum.Dramatic,
			},
			{
				character: 'Isabella',
				quote: "No matter how many times I'm reborn, I'll still choose to be your mother.",
				mood: MoodEnum.Emotional,
			},
			{
				character: 'Emma',
				quote: "I want to save everyone! If I can't, I don't want to escape!",
				mood: MoodEnum.Serious,
			},
			{
				character: 'Norman',
				quote: "It's fine. I'm going to turn things around.",
				mood: MoodEnum.Epic,
			},
			{
				character: 'Ray',
				quote: "Don't depend on others. Don't be too naive. The world isn't so sweet.",
				mood: MoodEnum.Philosophical,
			},
			{
				character: 'Krone',
				quote: 'A single piece of bait can be more valuable than a thousand thoughts.',
				mood: MoodEnum.Villainous,
			},
		],
	},
	{
		title: 'Parasyte: The Maxim',
		protagonist: 'Shinichi Izumi',
		universe: 'Modern-day Tokyo',
		rating: 8.2,
		quotes: [
			{
				character: 'Migi',
				quote: "If you ask me, a being's purpose is to eat. That's all.",
				mood: MoodEnum.Philosophical,
			},
			{
				character: 'Shinichi Izumi',
				quote: "We're all born with a certain potential. But you can only achieve it if you work hard.",
				mood: MoodEnum.Motivational,
			},
			{
				character: 'Reiko Tamura',
				quote: "Who should be allowed to live? Who should be allowed to die? It's not our choice.",
				mood: MoodEnum.Serious,
			},
			{
				character: 'Migi',
				quote: 'I find humans to be the closest things to demons.',
				mood: MoodEnum.Dramatic,
			},
			{
				character: 'Shinichi Izumi',
				quote: "You can't just keep piling your garbage on top of things. Eventually, you'll reach a breaking point.",
				mood: MoodEnum.Serious,
			},
			{
				character: 'Uragami',
				quote: "Humans are all twisted. That's why I like watching them suffer.",
				mood: MoodEnum.Villainous,
			},
			{
				character: 'Gotou',
				quote: 'I will exterminate everything in my path. That is my purpose.',
				mood: MoodEnum.Epic,
			},
			{
				character: 'Migi',
				quote: 'Shinichi, your heart is beating too fast. Are you malfunctioning?',
				mood: MoodEnum.Funny,
			},
		],
	},
	{
		title: 'Bleach: Thousand-Year Blood War',
		protagonist: 'Ichigo Kurosaki',
		universe: 'Soul Society',
		rating: 9.0,
		quotes: [
			{
				character: 'Yhwach',
				quote: 'Fear is necessary for evolution. The fear that comes from not knowing what happens next.',
				mood: MoodEnum.Philosophical,
			},
			{
				character: 'Ichigo Kurosaki',
				quote: "I won't let my fate be shattered! I will shatter the wheel of destiny!",
				mood: MoodEnum.Epic,
			},
			{
				character: 'Uryu Ishida',
				quote: 'The moment you despair, you open yourself up to defeat.',
				mood: MoodEnum.Motivational,
			},
			{
				character: 'Shunsui Kyoraku',
				quote: "When you're on the battlefield, both sides are evil. There is no good or bad.",
				mood: MoodEnum.Serious,
			},
			{
				character: 'Byakuya Kuchiki',
				quote: 'Arrogance is for the doomed.',
				mood: MoodEnum.Dramatic,
			},
			{
				character: 'Renji Abarai',
				quote: 'I am here. There is no better security than this.',
				mood: MoodEnum.Inspirational,
			},
			{
				character: 'Yhwach',
				quote: 'A villain? I am a god who will bring an end to a corrupt world.',
				mood: MoodEnum.Villainous,
			},
			{
				character: 'Ichigo Kurosaki',
				quote: 'The Blade Is Me.',
				mood: MoodEnum.Epic,
			},
		],
	},
	{
		title: 'Monster',
		protagonist: 'Dr. Kenzou Tenma',
		universe: 'Late 20th Century Europe',
		rating: 8.7,
		quotes: [
			{
				character: 'Johan Liebert',
				quote: 'The only thing all humans are equal in is death.',
				mood: MoodEnum.Philosophical,
			},
			{
				character: 'Dr. Tenma',
				quote: 'The only thing a person can control is their own life.',
				mood: MoodEnum.Serious,
			},
			{
				character: 'Inspector Lunge',
				quote: 'I am not here to judge. I am here to find the truth.',
				mood: MoodEnum.Dramatic,
			},
			{
				character: 'Johan Liebert',
				quote: 'Tell me, Doctor, what is the meaning of being born?',
				mood: MoodEnum.Philosophical,
			},
			{
				character: 'Dr. Tenma',
				quote: "I can't let him kill anyone else. I have to stop him.",
				mood: MoodEnum.Motivational,
			},
			{
				character: 'Dieter',
				quote: "Don't worry, Dr. Tenma. You're a good person.",
				mood: MoodEnum.Emotional,
			},
			{
				character: 'Roberto',
				quote: 'There is no evil. There is only the fear of being alone.',
				mood: MoodEnum.Villainous,
			},
			{
				character: 'Anna Liebert',
				quote: "I won't let my twin destroy the world.",
				mood: MoodEnum.Epic,
			},
		],
	},
	{
		title: 'Bleach',
		protagonist: 'Ichigo Kurosaki',
		universe: 'Soul Society',
		rating: 8.2,
		quotes: [
			{
				character: 'Ichigo Kurosaki',
				quote: "If I can't protect them from the wheel, then give me a strong blade to shatter fate.",
				mood: MoodEnum.Epic,
			},
			{
				character: 'Urahara Kisuke',
				quote: "If you dodge, 'I won't let them cut me.' If you protect, 'I won't let them die.' If you attack, 'I'll cut them'.",
				mood: MoodEnum.Philosophical,
			},
			{
				character: 'Gin Ichimaru',
				quote: "It's easier to crush a dream than to realize one.",
				mood: MoodEnum.Villainous,
			},
			{
				character: 'Toshiro Hitsugaya',
				quote: 'I hate having to look up to anyone.',
				mood: MoodEnum.Funny,
			},
			{
				character: 'Rukia Kuchiki',
				quote: 'It is meaningless to just live... to just fight. I want to win.',
				mood: MoodEnum.Motivational,
			},
			{
				character: 'Aizen Sousuke',
				quote: "The difference in power is a subtle thing. It's often the small details that matter most.",
				mood: MoodEnum.Serious,
			},
			{
				character: 'Byakuya Kuchiki',
				quote: "I don't remember saying that I would kill you because I'm a Soul Reaper. I'm killing you because you aimed your blade at my only pride.",
				mood: MoodEnum.Dramatic,
			},
			{
				character: 'Orihime Inoue',
				quote: "I wish I could live life five times over. Then, for those five times... I'd fall in love with the same person...",
				mood: MoodEnum.Emotional,
			},
		],
	},
	{
		title: 'One Punch Man',
		protagonist: 'Saitama',
		universe: 'Z-City',
		rating: 8.6,
		quotes: [
			{
				character: 'Saitama',
				quote: 'OK.',
				mood: MoodEnum.Funny,
			},
			{
				character: 'Saitama',
				quote: "I'm just a guy who's a hero for fun.",
				mood: MoodEnum.Serious,
			},
			{
				character: 'Genos',
				quote: 'Sensei, your power level is immeasurable.',
				mood: MoodEnum.Epic,
			},
			{
				character: 'Saitama',
				quote: 'If you really want to be strong, stop caring about what others think of you.',
				mood: MoodEnum.Philosophical,
			},
			{
				character: 'Bang (Silver Fang)',
				quote: 'The true nature of evil is chaos and disorder. We must maintain peace.',
				mood: MoodEnum.Serious,
			},
			{
				character: 'Garou',
				quote: 'I want to become the monster that everyone fears. The one true absolute evil.',
				mood: MoodEnum.Villainous,
			},
			{
				character: 'Saitama',
				quote: "Leave tomorrow's problems to tomorrow's you.",
				mood: MoodEnum.Inspirational,
			},
			{
				character: 'King',
				quote: 'I am King. The strongest man on Earth. Now tremble!',
				mood: MoodEnum.Funny,
			},
		],
	},
	{
		title: 'Naruto',
		protagonist: 'Naruto Uzumaki',
		universe: 'The Hidden Leaf Village',
		rating: 8.4,
		quotes: [
			{
				character: 'Naruto Uzumaki',
				quote: "I'm not gonna run away! I never go back on my word! That's my nindo: my ninja way!",
				mood: MoodEnum.Motivational,
			},
			{
				character: 'Itachi Uchiha',
				quote: "People live their lives bound by what they accept as correct and true. That's how they define 'reality'.",
				mood: MoodEnum.Philosophical,
			},
			{
				character: 'Gaara',
				quote: 'When did I stop being me? I am me, and you are you.',
				mood: MoodEnum.Dramatic,
			},
			{
				character: 'Obito Uchiha',
				quote: 'Those who break the rules are trash, but those who abandon their comrades are worse than trash!',
				mood: MoodEnum.Inspirational,
			},
			{
				character: 'Jiraiya',
				quote: 'A man learns nothing from victory. Only from defeat.',
				mood: MoodEnum.Serious,
			},
			{
				character: 'Naruto Uzumaki',
				quote: "I'll change the Hyuuga for you, Neji!",
				mood: MoodEnum.Emotional,
			},
			{
				character: 'Orochimaru',
				quote: 'The greatest power is the quest for eternal knowledge.',
				mood: MoodEnum.Villainous,
			},
			{
				character: 'Rock Lee',
				quote: "A genius, huh? What does that mean? 'Genius'? So I was born with a lot of skill? So what?!",
				mood: MoodEnum.Epic,
			},
		],
	},
	{
		title: 'Hunter x Hunter',
		protagonist: 'Gon Freecss',
		universe: 'The Hunter World',
		rating: 9.0,
		quotes: [
			{
				character: 'Ging Freecss',
				quote: "You should enjoy the little detours to the fullest. Because that's where you'll find the things more important than what you want.",
				mood: MoodEnum.Philosophical,
			},
			{
				character: 'Killua Zoldyck',
				quote: "I apologise for what's about to happen. I'm just burning off some steam.",
				mood: MoodEnum.Epic,
			},
			{
				character: 'Meruem',
				quote: 'I have realized that fear is the most vital of all emotions.',
				mood: MoodEnum.Serious,
			},
			{
				character: 'Gon Freecss',
				quote: "If you don't like the hand that fate's dealt you, fight for a new one!",
				mood: MoodEnum.Motivational,
			},
			{
				character: 'Hisoka Morow',
				quote: 'A true magician never runs away from an audience.',
				mood: MoodEnum.Villainous,
			},
			{
				character: 'Kite',
				quote: "When a human can't take any more pain, they will do anything to forget.",
				mood: MoodEnum.Dramatic,
			},
			{
				character: 'Netero',
				quote: 'It is not the mountains we conquer, but ourselves.',
				mood: MoodEnum.Inspirational,
			},
			{
				character: 'Leorio Paradinight',
				quote: 'I want to be a doctor so I can help people. Not for fame or money.',
				mood: MoodEnum.Emotional,
			},
		],
	},
	{
		title: 'My Hero Academia',
		protagonist: 'Izuku Midoriya',
		universe: 'High School (obviously)',
		rating: 8.2,
		quotes: [
			{
				character: 'Izuku Midoriya',
				quote: "If I can't do it, then I'll just have to make myself capable of doing it!",
				mood: MoodEnum.Motivational,
			},
			{
				character: 'All Might',
				quote: 'Go beyond! Plus Ultra!',
				mood: MoodEnum.Epic,
			},
			{
				character: 'Katsuki Bakugo',
				quote: "I'll win with all I've got, and I'll beat you like I always do!",
				mood: MoodEnum.Inspirational,
			},
			{
				character: 'Shoto Todoroki',
				quote: "I can't afford to be selfish. Not when there are lives at stake.",
				mood: MoodEnum.Serious,
			},
			{
				character: 'Tenya Iida',
				quote: 'To be a hero, one must constantly be growing and challenging their own limits.',
				mood: MoodEnum.Philosophical,
			},
			{
				character: 'Shigaraki Tomura',
				quote: 'All for one, and one for all. What a joke. Heroes are just self-righteous thugs.',
				mood: MoodEnum.Villainous,
			},
			{
				character: 'Ochaco Uraraka',
				quote: "I have to work hard, or I'll never catch up to everyone else!",
				mood: MoodEnum.Inspirational,
			},
			{
				character: 'Tsuyu Asui',
				quote: "Kero. I'm always saying what's on my mind.",
				mood: MoodEnum.Funny,
			},
		],
	},
	{
		title: 'Vinland Saga',
		protagonist: 'Thorfinn',
		universe: 'Viking Age Europe',
		rating: 8.8,
		quotes: [
			{
				character: 'Thorfinn',
				quote: 'I have no enemies. No one has any enemies.',
				mood: MoodEnum.Philosophical,
			},
			{
				character: 'Askeladd',
				quote: 'A true warrior needs no sword.',
				mood: MoodEnum.Serious,
			},
			{
				character: 'Canute',
				quote: "Love, it's a feeling of wanting to do good for another person.",
				mood: MoodEnum.Emotional,
			},
			{
				character: 'Thors',
				quote: "You don't need to be strong to be a warrior. You just need to have a kind heart.",
				mood: MoodEnum.Inspirational,
			},
			{
				character: 'Askeladd',
				quote: "What do you need a reason for? If there's someone you hate, all you have to do is kill them.",
				mood: MoodEnum.Villainous,
			},
			{
				character: 'Thorfinn',
				quote: "I'm going to follow him to the ends of the earth and kill him with my own hands!",
				mood: MoodEnum.Dramatic,
			},
			{
				character: 'Canute',
				quote: 'A good king is one who gives peace to his people, not one who wages war.',
				mood: MoodEnum.Motivational,
			},
			{
				character: 'Thors',
				quote: 'A true warrior is a man who understands that he does not need a weapon.',
				mood: MoodEnum.Epic,
			},
		],
	},
	{
		title: 'Fullmetal Alchemist: Brotherhood',
		protagonist: 'Edward Elric',
		universe: 'Amestris',
		rating: 9.1,
		quotes: [
			{
				character: 'Edward Elric',
				quote: "A lesson without pain is meaningless. That's because no one can gain without sacrifice.",
				mood: MoodEnum.Philosophical,
			},
			{
				character: 'Roy Mustang',
				quote: "Dogs embody loyalty, they follow their master's commands above all else!",
				mood: MoodEnum.Funny,
			},
			{
				character: 'Alphonse Elric',
				quote: "Even if we're just puppets, we'll fight until the end to get our original bodies back!",
				mood: MoodEnum.Motivational,
			},
			{
				character: 'Van Hohenheim',
				quote: "There's no such thing as a perfect life. Everyone has their flaws.",
				mood: MoodEnum.Serious,
			},
			{
				character: 'Scar',
				quote: 'I am vengeance. I am the one who will destroy all state alchemists.',
				mood: MoodEnum.Dramatic,
			},
			{
				character: 'Edward Elric',
				quote: "Fine, there's no way I'm dying before you do, you morally bankrupt colonel with a God complex.",
				mood: MoodEnum.Funny,
			},
			{
				character: 'Father',
				quote: 'You are all nothing more than tools in my great plan.',
				mood: MoodEnum.Villainous,
			},
			{
				character: 'Olivier Mira Armstrong',
				quote: 'Survival of the fittest. The law of nature.',
				mood: MoodEnum.Epic,
			},
		],
	},
	{
		title: 'Naruto: Shippuden',
		protagonist: 'Naruto Uzumaki',
		universe: 'The Hidden Leaf Village',
		rating: 8.7,
		quotes: [
			{
				character: 'Naruto Uzumaki',
				quote: "I'm not going to stop. I'm going to save the world, even if it kills me!",
				mood: MoodEnum.Epic,
			},
			{
				character: 'Nagato (Pain)',
				quote: "We are but men, drawn to act in the name of revenge we deem to be 'justice'.",
				mood: MoodEnum.Philosophical,
			},
			{
				character: 'Itachi Uchiha',
				quote: "We don't know what kind of people we truly are until the moment before our deaths.",
				mood: MoodEnum.Serious,
			},
			{
				character: 'Obito Uchiha',
				quote: 'The future is not for you. It is for us, who live here and now!',
				mood: MoodEnum.Dramatic,
			},
			{
				character: 'Madara Uchiha',
				quote: 'The concept of hope is nothing more than giving up. A word that holds no true meaning.',
				mood: MoodEnum.Villainous,
			},
			{
				character: 'Minato Namikaze',
				quote: 'A true ninja is one who endures even the most painful of situations.',
				mood: MoodEnum.Motivational,
			},
			{
				character: 'Shikamaru Nara',
				quote: "It's so annoying when women are smarter than men.",
				mood: MoodEnum.Funny,
			},
			{
				character: 'Naruto Uzumaki',
				quote: 'If you kill someone, someone else will kill you. This hatred binds us together.',
				mood: MoodEnum.Emotional,
			},
		],
	},
	{
		title: 'Death Note',
		protagonist: 'Light Yagami',
		universe: 'Modern-day Tokyo',
		rating: 8.9,
		quotes: [
			{
				character: 'Light Yagami',
				quote: 'I will create a new world, a utopia free of criminals, and I will be its god.',
				mood: MoodEnum.Villainous,
			},
			{
				character: 'L',
				quote: "If you just move the cake around and keep eating, you won't get fat.",
				mood: MoodEnum.Funny,
			},
			{
				character: 'Misa Amane',
				quote: "I want to be useful to you. I don't care if I'm used as a pawn.",
				mood: MoodEnum.Emotional,
			},
			{
				character: 'Near',
				quote: "If you can't beat the game, if you can't solve the puzzle, you're nothing but a loser.",
				mood: MoodEnum.Serious,
			},
			{
				character: 'Light Yagami',
				quote: 'I am justice! I am the one who will save the people!',
				mood: MoodEnum.Dramatic,
			},
			{
				character: 'L',
				quote: 'The reason for not trying to know the unknowable... is to be prudent.',
				mood: MoodEnum.Philosophical,
			},
			{
				character: 'Ryuk',
				quote: 'Humans are so interesting.',
				mood: MoodEnum.Funny,
			},
			{
				character: 'Light Yagami',
				quote: "There is no heaven or hell. No matter what you do while you're alive, everyone goes to the same place once you die. Nothingness.",
				mood: MoodEnum.Serious,
			},
		],
	},
	{
		title: 'Chainsaw Man',
		protagonist: 'Denji',
		universe: 'Demon World',
		rating: 8.3,
		quotes: [
			{
				character: 'Denji',
				quote: 'I want a normal life! To eat good food and hold a girl!',
				mood: MoodEnum.Funny,
			},
			{
				character: 'Makima',
				quote: "The only thing a dog needs is its master's command.",
				mood: MoodEnum.Villainous,
			},
			{
				character: 'Power',
				quote: 'I am the great Power! Tremble before my overwhelming intellect!',
				mood: MoodEnum.Funny,
			},
			{
				character: 'Aki Hayakawa',
				quote: "If I can't protect those I care about, what's the point of my power?",
				mood: MoodEnum.Serious,
			},
			{
				character: 'Denji',
				quote: "If you get too attached, you'll feel more pain when they leave.",
				mood: MoodEnum.Emotional,
			},
			{
				character: 'Himeno',
				quote: "I prefer to kiss with a cigarette. It's more poetic.",
				mood: MoodEnum.Dramatic,
			},
			{
				character: 'Kishibe',
				quote: 'A truly strong hunter is always a little crazy.',
				mood: MoodEnum.Philosophical,
			},
			{
				character: 'Makima',
				quote: "I want to use the Chainsaw Man's power to make the world a better place.",
				mood: MoodEnum.Epic,
			},
		],
	},
	{
		title: 'Jujutsu Kaisen',
		protagonist: 'Yuji Itadori',
		universe: 'Tokyo Metropolitan Magic Technical College (obviously)',
		rating: 8.5,
		quotes: [
			{
				character: 'Satoru Gojo',
				quote: "I'm the strongest. I'm so powerful, I'm just lonely.",
				mood: MoodEnum.Epic,
			},
			{
				character: 'Yuji Itadori',
				quote: "I don't know how I'll feel when I die, but I don't want to regret how I lived.",
				mood: MoodEnum.Motivational,
			},
			{
				character: 'Megumi Fushiguro',
				quote: "I'm not a hero. I'm a sorcerer. I only save people on my own terms.",
				mood: MoodEnum.Serious,
			},
			{
				character: 'Nobara Kugisaki',
				quote: "I love myself when I'm strong, and I hate myself when I'm weak.",
				mood: MoodEnum.Inspirational,
			},
			{
				character: 'Sukuna',
				quote: "A king doesn't care about the feelings of his subjects. He only cares about his own amusement.",
				mood: MoodEnum.Villainous,
			},
			{
				character: 'Kento Nanami',
				quote: "I've been working too hard. I wish I was at a beach resort instead.",
				mood: MoodEnum.Funny,
			},
			{
				character: 'Geto Suguru',
				quote: 'The weak should be eliminated. They only hold back the strong.',
				mood: MoodEnum.Philosophical,
			},
			{
				character: 'Yuji Itadori',
				quote: 'People are only alive for a short time, so I want to live and die surrounded by a lot of people.',
				mood: MoodEnum.Emotional,
			},
		],
	},
	{
		title: 'One Piece',
		protagonist: 'Monkey D. Luffy',
		universe: 'The Grand Line',
		rating: 9.0,
		quotes: [
			{
				character: 'Monkey D. Luffy',
				quote: "I'm gonna be the King of the Pirates!",
				mood: MoodEnum.Epic,
			},
			{
				character: 'Dr. Hiriluk',
				quote: "People's dreams have no ends.",
				mood: MoodEnum.Philosophical,
			},
			{
				character: 'Roronoa Zoro',
				quote: 'Only I can call my dream stupid!',
				mood: MoodEnum.Motivational,
			},
			{
				character: 'Whitebeard',
				quote: 'One Piece, does exist!',
				mood: MoodEnum.Inspirational,
			},
			{
				character: 'Donquixote Doflamingo',
				quote: 'Pirates are evil? The Marines are righteous? Justice will prevail, you say? But of course it will! Whoever wins this war becomes justice!',
				mood: MoodEnum.Villainous,
			},
			{
				character: 'Sanji',
				quote: "A cook's job is to feed everyone. Even if they are enemies.",
				mood: MoodEnum.Serious,
			},
			{
				character: 'Usopp',
				quote: "I'll do what I want till the end.",
				mood: MoodEnum.Funny,
			},
			{
				character: 'Portgas D. Ace',
				quote: "I won't die, partner.",
				mood: MoodEnum.Emotional,
			},
		],
	},
	{
		title: 'Attack on Titan',
		protagonist: 'Eren Yeager',
		universe: 'The Walls',
		rating: 9.1,
		quotes: [
			{
				character: 'Erwin Smith',
				quote: 'My soldiers, scream! My soldiers, rage! My soldiers, fight!',
				mood: MoodEnum.Epic,
			},
			{
				character: 'Eren Yeager',
				quote: "I'm going to exterminate every single one of them. I'll drive them all out!",
				mood: MoodEnum.Dramatic,
			},
			{
				character: 'Levi Ackerman',
				quote: "The only thing we're allowed to do is believe that we won't regret the choice we made.",
				mood: MoodEnum.Serious,
			},
			{
				character: 'Hange Zoë',
				quote: "If you don't fight, you can't win!",
				mood: MoodEnum.Motivational,
			},
			{
				character: 'Reiner Braun',
				quote: 'The world is cruel. And yet, so beautiful.',
				mood: MoodEnum.Philosophical,
			},
			{
				character: 'Mikasa Ackerman',
				quote: 'This world is a cruel place, and yet, I love it.',
				mood: MoodEnum.Emotional,
			},
			{
				character: 'Zeke Yeager',
				quote: 'The only solution for this cruel world is to eliminate the source of the conflict: the Eldians.',
				mood: MoodEnum.Villainous,
			},
			{
				character: 'Pixis Dot',
				quote: "When people begin to fight, it's on the pretext of the former type of people and it justifies the latter when they stop.",
				mood: MoodEnum.Philosophical,
			},
		],
	},
	{
		title: 'Demon Slayer',
		protagonist: 'Tanjiro Kamado',
		universe: 'Taisho Era Japan',
		rating: 8.6,
		quotes: [
			{
				character: 'Tanjiro Kamado',
				quote: "The bond between Nezuko and me can't be severed by anyone!",
				mood: MoodEnum.Emotional,
			},
			{
				character: 'Giyu Tomioka',
				quote: "Don't ever give up. If you give up, that's when the game ends.",
				mood: MoodEnum.Motivational,
			},
			{
				character: 'Kyojuro Rengoku',
				quote: 'Set your heart ablaze! Go beyond your limits!',
				mood: MoodEnum.Epic,
			},
			{
				character: 'Inosuke Hashibira',
				quote: "I'm going to defeat all the demons! I'm the king of the mountains!",
				mood: MoodEnum.Funny,
			},
			{
				character: 'Muzan Kibutsuji',
				quote: 'Perfectly preserved, eternally shining, I am the ultimate life form.',
				mood: MoodEnum.Villainous,
			},
			{
				character: 'Shinobu Kocho',
				quote: "If you can't use a sword, you can still be a Demon Slayer. You just need to find another way.",
				mood: MoodEnum.Philosophical,
			},
			{
				character: 'Zenitsu Agatsuma',
				quote: "I'm going to die! I'm definitely going to die!",
				mood: MoodEnum.Funny,
			},
			{
				character: 'Sakonji Urokodaki',
				quote: 'A master is one who knows when to endure and when to act.',
				mood: MoodEnum.Serious,
			},
			{
				character: 'Tengen Uzui',
				quote: 'My life is about being flamboyant!',
				mood: MoodEnum.Inspirational,
			},
			{
				character: 'Mitsuri Kanroji',
				quote: "If I can protect everyone, I'll do it with all my might!",
				mood: MoodEnum.Inspirational,
			},
		],
	},
];
