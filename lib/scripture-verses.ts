export type ScriptureTheme = 'love' | 'joy' | 'peace' | 'patience' | 'kindness' | 'goodness' | 'faithfulness' | 'gentleness' | 'self-control' | 'faith' | 'strength' | 'hope' | 'trust' | 'wisdom' | 'discipline' | 'gratitude' | 'forgiveness' | 'humility' | 'perseverance' | 'encouragement' | 'serving' | 'prayer' | 'identity';

export interface ScriptureVerse {
  id: string;
  reference: string;
  text: string;
  theme: ScriptureTheme;
  group: string;
}

export const SCRIPTURE_THEME_LABELS: Record<ScriptureTheme, string> = {
  "love": "Love",
  "joy": "Joy",
  "peace": "Peace",
  "patience": "Patience",
  "kindness": "Kindness",
  "goodness": "Goodness",
  "faithfulness": "Faithfulness",
  "gentleness": "Gentleness",
  "self-control": "Self-Control",
  "faith": "Faith",
  "strength": "Strength & Courage",
  "hope": "Hope",
  "trust": "Trust",
  "wisdom": "Wisdom",
  "discipline": "Discipline",
  "gratitude": "Gratitude",
  "forgiveness": "Forgiveness",
  "humility": "Humility",
  "perseverance": "Perseverance",
  "encouragement": "Encouragement",
  "serving": "Serving Others",
  "prayer": "Prayer",
  "identity": "Identity in Christ"
} as Record<ScriptureTheme, string>;

export const SCRIPTURE_VERSES: ScriptureVerse[] = [
  {
    "id": "1-corinthians-13-4-8",
    "theme": "love",
    "group": "Fruits of the Spirit",
    "reference": "1 Corinthians 13:4-8",
    "text": "Love is patient and is kind. Love does not envy. Love does not brag, is not proud, does not behave itself inappropriately, does not seek its own way, is not provoked, takes no account of evil; does not rejoice in unrighteousness, but rejoices with the truth; bears all things, believes all things, hopes all things, endures all things. Love never fails. But where there are prophecies, they will be done away with. Where there are various languages, they will cease. Where there is knowledge, it will be done away with."
  },
  {
    "id": "john-13-34-35",
    "theme": "love",
    "group": "Fruits of the Spirit",
    "reference": "John 13:34-35",
    "text": "A new commandment I give to you, that you love one another. Just as I have loved you, you also love one another. By this everyone will know that you are my disciples, if you have love for one another."
  },
  {
    "id": "1-john-4-7-8",
    "theme": "love",
    "group": "Fruits of the Spirit",
    "reference": "1 John 4:7-8",
    "text": "Beloved, let us love one another, for love is of God; and everyone who loves has been born of God and knows God. He who does not love does not know God, for God is love."
  },
  {
    "id": "romans-12-9-10",
    "theme": "love",
    "group": "Fruits of the Spirit",
    "reference": "Romans 12:9-10",
    "text": "Let love be without hypocrisy. Abhor that which is evil. Cling to that which is good. In love of the brothers be tenderly affectionate to one another; in honor preferring one another."
  },
  {
    "id": "colossians-3-14",
    "theme": "love",
    "group": "Fruits of the Spirit",
    "reference": "Colossians 3:14",
    "text": "Above all these things, walk in love, which is the bond of perfection."
  },
  {
    "id": "ephesians-5-1-2",
    "theme": "love",
    "group": "Fruits of the Spirit",
    "reference": "Ephesians 5:1-2",
    "text": "Be therefore imitators of God, as beloved children. Walk in love, even as Christ also loved us and gave himself up for us, an offering and a sacrifice to God for a sweet-smelling fragrance."
  },
  {
    "id": "nehemiah-8-10",
    "theme": "joy",
    "group": "Fruits of the Spirit",
    "reference": "Nehemiah 8:10",
    "text": "Then he said to them, \"Go your way. Eat the fat, drink the sweet, and send portions to him for whom nothing is prepared, for today is holy to our Lord. Do not be grieved, for the joy of the Lord is your strength.\""
  },
  {
    "id": "philippians-4-4",
    "theme": "joy",
    "group": "Fruits of the Spirit",
    "reference": "Philippians 4:4",
    "text": "Rejoice in the Lord always! Again I will say, \"Rejoice!\""
  },
  {
    "id": "psalm-16-11",
    "theme": "joy",
    "group": "Fruits of the Spirit",
    "reference": "Psalm 16:11",
    "text": "You will show me the path of life. In your presence is fullness of joy. In your right hand there are pleasures forever more."
  },
  {
    "id": "romans-15-13",
    "theme": "joy",
    "group": "Fruits of the Spirit",
    "reference": "Romans 15:13",
    "text": "Now may the God of hope fill you with all joy and peace in believing, that you may abound in hope in the power of the Holy Spirit."
  },
  {
    "id": "james-1-2-3",
    "theme": "joy",
    "group": "Fruits of the Spirit",
    "reference": "James 1:2-3",
    "text": "Count it all joy, my brothers, when you fall into various temptations, knowing that the testing of your faith produces endurance."
  },
  {
    "id": "john-14-27",
    "theme": "peace",
    "group": "Fruits of the Spirit",
    "reference": "John 14:27",
    "text": "Peace I leave with you. My peace I give to you; not as the world gives, I give to you. Do not let your heart be troubled, neither let it be fearful."
  },
  {
    "id": "philippians-4-6-7",
    "theme": "peace",
    "group": "Fruits of the Spirit",
    "reference": "Philippians 4:6-7",
    "text": "In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus."
  },
  {
    "id": "isaiah-26-3",
    "theme": "peace",
    "group": "Fruits of the Spirit",
    "reference": "Isaiah 26:3",
    "text": "You will keep whoever's mind is steadfast in perfect peace, because he trusts in you."
  },
  {
    "id": "romans-5-1",
    "theme": "peace",
    "group": "Fruits of the Spirit",
    "reference": "Romans 5:1",
    "text": "Being therefore justified by faith, we have peace with God through our Lord Jesus Christ."
  },
  {
    "id": "colossians-3-15",
    "theme": "peace",
    "group": "Fruits of the Spirit",
    "reference": "Colossians 3:15",
    "text": "And let the peace of God rule in your hearts, to which also you were called in one body, and be thankful."
  },
  {
    "id": "james-5-7-8",
    "theme": "patience",
    "group": "Fruits of the Spirit",
    "reference": "James 5:7-8",
    "text": "Be patient therefore, brothers, until the coming of the Lord. Behold, the farmer waits for the precious fruit of the earth, being patient over it, until it receives the early and late rain. You also be patient. Establish your hearts, for the coming of the Lord is at hand."
  },
  {
    "id": "romans-12-12",
    "theme": "patience",
    "group": "Fruits of the Spirit",
    "reference": "Romans 12:12",
    "text": "Rejoicing in hope, enduring in troubles, continuing steadfastly in prayer."
  },
  {
    "id": "ephesians-4-2",
    "theme": "patience",
    "group": "Fruits of the Spirit",
    "reference": "Ephesians 4:2",
    "text": "with all lowliness and humility, with patience, bearing with one another in love."
  },
  {
    "id": "colossians-3-12",
    "theme": "patience",
    "group": "Fruits of the Spirit",
    "reference": "Colossians 3:12",
    "text": "Put on therefore, as God's chosen ones, holy and beloved, a heart of compassion, kindness, lowliness, humility, and perseverance."
  },
  {
    "id": "ephesians-4-32",
    "theme": "kindness",
    "group": "Fruits of the Spirit",
    "reference": "Ephesians 4:32",
    "text": "And be kind to one another, tenderhearted, forgiving each other, just as God also in Christ forgave you."
  },
  {
    "id": "proverbs-11-17",
    "theme": "kindness",
    "group": "Fruits of the Spirit",
    "reference": "Proverbs 11:17",
    "text": "The merciful man does good to his own soul, but he who is cruel troubles his own flesh."
  },
  {
    "id": "luke-6-35",
    "theme": "kindness",
    "group": "Fruits of the Spirit",
    "reference": "Luke 6:35",
    "text": "But love your enemies, and do good, and lend, expecting nothing back; and your reward will be great, and you will be children of the Most High; for he is kind toward the unthankful and evil."
  },
  {
    "id": "micah-6-8",
    "theme": "kindness",
    "group": "Fruits of the Spirit",
    "reference": "Micah 6:8",
    "text": "He has shown you, O man, what is good. What does the Lord require of you, but to act justly, to love mercy, and to walk humbly with your God?"
  },
  {
    "id": "psalm-23-6",
    "theme": "goodness",
    "group": "Fruits of the Spirit",
    "reference": "Psalm 23:6",
    "text": "Surely goodness and loving kindness shall follow me all the days of my life, and I will dwell in the Lord's house forever."
  },
  {
    "id": "galatians-6-9",
    "theme": "goodness",
    "group": "Fruits of the Spirit",
    "reference": "Galatians 6:9",
    "text": "Let's not be weary in doing good, for we will reap in due season if we don't give up."
  },
  {
    "id": "romans-12-21",
    "theme": "goodness",
    "group": "Fruits of the Spirit",
    "reference": "Romans 12:21",
    "text": "Don't be overcome by evil, but overcome evil with good."
  },
  {
    "id": "titus-3-8",
    "theme": "goodness",
    "group": "Fruits of the Spirit",
    "reference": "Titus 3:8",
    "text": "This saying is faithful, and concerning these things I desire that you affirm confidently, so that those who have believed God may be careful to maintain good works. These things are good and profitable to men."
  },
  {
    "id": "proverbs-3-3-4",
    "theme": "faithfulness",
    "group": "Fruits of the Spirit",
    "reference": "Proverbs 3:3-4",
    "text": "Don't let kindness and truth forsake you. Bind them around your neck. Write them on the tablet of your heart. So you will find favor, and good understanding in the sight of God and man."
  },
  {
    "id": "lamentations-3-22-23",
    "theme": "faithfulness",
    "group": "Fruits of the Spirit",
    "reference": "Lamentations 3:22-23",
    "text": "It is because of the Lord's loving kindnesses that we are not consumed, because his compassion doesn't fail. They are new every morning. Great is your faithfulness."
  },
  {
    "id": "hebrews-10-23",
    "theme": "faithfulness",
    "group": "Fruits of the Spirit",
    "reference": "Hebrews 10:23",
    "text": "Let's hold fast the confession of our hope without wavering; for he who promised is faithful."
  },
  {
    "id": "matthew-25-21",
    "theme": "faithfulness",
    "group": "Fruits of the Spirit",
    "reference": "Matthew 25:21",
    "text": "His lord said to him, 'Well done, good and faithful servant. You have been faithful over a few things. I will set you over many things. Enter into your lord's joy.'"
  },
  {
    "id": "philippians-4-5",
    "theme": "gentleness",
    "group": "Fruits of the Spirit",
    "reference": "Philippians 4:5",
    "text": "Let your gentleness be known to all men. The Lord is at hand."
  },
  {
    "id": "proverbs-15-1",
    "theme": "gentleness",
    "group": "Fruits of the Spirit",
    "reference": "Proverbs 15:1",
    "text": "A gentle answer turns away wrath, but a harsh word stirs up anger."
  },
  {
    "id": "galatians-6-1",
    "theme": "gentleness",
    "group": "Fruits of the Spirit",
    "reference": "Galatians 6:1",
    "text": "Brothers, even if a man is caught in some fault, you who are spiritual must restore such a one in a spirit of gentleness; looking to yourself so that you also aren't tempted."
  },
  {
    "id": "1-peter-3-15",
    "theme": "gentleness",
    "group": "Fruits of the Spirit",
    "reference": "1 Peter 3:15",
    "text": "But sanctify the Lord God in your hearts. Always be ready to give an answer to everyone who asks you a reason concerning the hope that is in you, with humility and fear."
  },
  {
    "id": "2-timothy-1-7",
    "theme": "self-control",
    "group": "Fruits of the Spirit",
    "reference": "2 Timothy 1:7",
    "text": "For God didn't give us a spirit of fear, but of power, love, and self-control."
  },
  {
    "id": "proverbs-25-28",
    "theme": "self-control",
    "group": "Fruits of the Spirit",
    "reference": "Proverbs 25:28",
    "text": "He whose spirit is without restraint is like a city that is broken down and without walls."
  },
  {
    "id": "1-corinthians-9-24-27",
    "theme": "self-control",
    "group": "Fruits of the Spirit",
    "reference": "1 Corinthians 9:24-27",
    "text": "Don't you know that those who run in a race all run, but one receives the prize? Run like that, that you may win. Everyone who strives in the games exercises self-control in all things. I therefore run like that, not as uncertainty. I fight like that, not as beating the air, but I beat my body and bring it into submission, lest by any means, after I have preached to others, I myself should be rejected."
  },
  {
    "id": "titus-2-11-12",
    "theme": "self-control",
    "group": "Fruits of the Spirit",
    "reference": "Titus 2:11-12",
    "text": "For the grace of God has appeared, bringing salvation to all men, instructing us to the intent that, denying ungodliness and worldly lusts, we would live soberly, righteously, and godly in this present age."
  },
  {
    "id": "hebrews-11-1",
    "theme": "faith",
    "group": "Faith",
    "reference": "Hebrews 11:1",
    "text": "Now faith is assurance of things hoped for, proof of things not seen."
  },
  {
    "id": "mark-9-23",
    "theme": "faith",
    "group": "Faith",
    "reference": "Mark 9:23",
    "text": "Jesus said to him, \"If you can believe, all things are possible to him who believes.\""
  },
  {
    "id": "matthew-17-20",
    "theme": "faith",
    "group": "Faith",
    "reference": "Matthew 17:20",
    "text": "If you have faith as a grain of mustard seed, you will tell this mountain, \"Move from here to there,\" and it will move; and nothing will be impossible for you."
  },
  {
    "id": "romans-10-17",
    "theme": "faith",
    "group": "Faith",
    "reference": "Romans 10:17",
    "text": "So faith comes by hearing, and hearing by the word of God."
  },
  {
    "id": "2-corinthians-5-7",
    "theme": "faith",
    "group": "Faith",
    "reference": "2 Corinthians 5:7",
    "text": "for we walk by faith, not by sight."
  },
  {
    "id": "james-2-17",
    "theme": "faith",
    "group": "Faith",
    "reference": "James 2:17",
    "text": "Even so faith, if it has no works, is dead in itself."
  },
  {
    "id": "hebrews-11-6",
    "theme": "faith",
    "group": "Faith",
    "reference": "Hebrews 11:6",
    "text": "Without faith it is impossible to be well pleasing to him, for he who comes to God must believe that he exists, and that he is a rewarder of those who seek him."
  },
  {
    "id": "joshua-1-9",
    "theme": "strength",
    "group": "Strength & Courage",
    "reference": "Joshua 1:9",
    "text": "Haven't I commanded you? Be strong and courageous. Don't be afraid. Don't be dismayed, for the Lord your God is with you wherever you go."
  },
  {
    "id": "isaiah-41-10",
    "theme": "strength",
    "group": "Strength & Courage",
    "reference": "Isaiah 41:10",
    "text": "Don't you be afraid, for I am with you. Don't be dismayed, for I am your God. I will strengthen you. Yes, I will help you. Yes, I will uphold you with the right hand of my righteousness."
  },
  {
    "id": "philippians-4-13",
    "theme": "strength",
    "group": "Strength & Courage",
    "reference": "Philippians 4:13",
    "text": "I can do all things through Christ who strengthens me."
  },
  {
    "id": "psalm-46-1",
    "theme": "strength",
    "group": "Strength & Courage",
    "reference": "Psalm 46:1",
    "text": "God is our refuge and strength, a very present help in trouble."
  },
  {
    "id": "isaiah-40-31",
    "theme": "strength",
    "group": "Strength & Courage",
    "reference": "Isaiah 40:31",
    "text": "But those who wait for the Lord will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint."
  },
  {
    "id": "deuteronomy-31-6",
    "theme": "strength",
    "group": "Strength & Courage",
    "reference": "Deuteronomy 31:6",
    "text": "Be strong and courageous. Do not be afraid or scared, for the Lord your God himself is who goes with you. He will not fail you nor forsake you."
  },
  {
    "id": "jeremiah-29-11",
    "theme": "hope",
    "group": "Hope",
    "reference": "Jeremiah 29:11",
    "text": "For I know the thoughts that I think toward you, says the Lord, thoughts of peace, and not of evil, to give you hope and a future."
  },
  {
    "id": "psalm-42-11",
    "theme": "hope",
    "group": "Hope",
    "reference": "Psalm 42:11",
    "text": "Why are you in despair, my soul? Why are you disturbed within me? Hope in God! For I shall still praise him, the saving help of my countenance, and my God."
  },
  {
    "id": "hebrews-6-19",
    "theme": "hope",
    "group": "Hope",
    "reference": "Hebrews 6:19",
    "text": "This hope we have as an anchor of the soul, a hope both sure and steadfast."
  },
  {
    "id": "romans-8-28",
    "theme": "hope",
    "group": "Hope",
    "reference": "Romans 8:28",
    "text": "We know that all things work together for good for those who love God, to those who are called according to his purpose."
  },
  {
    "id": "proverbs-3-5-6",
    "theme": "trust",
    "group": "Trust",
    "reference": "Proverbs 3:5-6",
    "text": "Trust in the Lord with all your heart, and don't lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight."
  },
  {
    "id": "psalm-37-5",
    "theme": "trust",
    "group": "Trust",
    "reference": "Psalm 37:5",
    "text": "Commit your way to the Lord. Trust also in him, and he will do this."
  },
  {
    "id": "psalm-56-3",
    "theme": "trust",
    "group": "Trust",
    "reference": "Psalm 56:3",
    "text": "When I am afraid, I will put my trust in you."
  },
  {
    "id": "isaiah-26-4",
    "theme": "trust",
    "group": "Trust",
    "reference": "Isaiah 26:4",
    "text": "Trust in the Lord forever; for in the Lord, the Lord, is an everlasting Rock."
  },
  {
    "id": "james-1-5",
    "theme": "wisdom",
    "group": "Wisdom",
    "reference": "James 1:5",
    "text": "But if any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach, and it will be given to him."
  },
  {
    "id": "proverbs-9-10",
    "theme": "wisdom",
    "group": "Wisdom",
    "reference": "Proverbs 9:10",
    "text": "The fear of the Lord is the beginning of wisdom. The knowledge of the Holy One is understanding."
  },
  {
    "id": "proverbs-2-6",
    "theme": "wisdom",
    "group": "Wisdom",
    "reference": "Proverbs 2:6",
    "text": "For the Lord gives wisdom. Out of his mouth comes knowledge and understanding."
  },
  {
    "id": "ecclesiastes-7-12",
    "theme": "wisdom",
    "group": "Wisdom",
    "reference": "Ecclesiastes 7:12",
    "text": "For wisdom is a defense, even as money is a defense; but the excellency of knowledge is that wisdom preserves the life of him who has it."
  },
  {
    "id": "hebrews-12-11",
    "theme": "discipline",
    "group": "Discipline",
    "reference": "Hebrews 12:11",
    "text": "All chastening seems for the present to be not joyous but grievous; yet afterward it yields the peaceful fruit of righteousness to those who have been exercised thereby."
  },
  {
    "id": "proverbs-12-1",
    "theme": "discipline",
    "group": "Discipline",
    "reference": "Proverbs 12:1",
    "text": "Whoever loves correction loves knowledge, but he who hates reproof is stupid."
  },
  {
    "id": "proverbs-13-24",
    "theme": "discipline",
    "group": "Discipline",
    "reference": "Proverbs 13:24",
    "text": "One who spares the rod hates his son, but one who loves him is careful to discipline him."
  },
  {
    "id": "1-corinthians-9-27",
    "theme": "discipline",
    "group": "Discipline",
    "reference": "1 Corinthians 9:27",
    "text": "But I beat my body and bring it into submission, lest by any means, after I have preached to others, I myself should be rejected."
  },
  {
    "id": "1-thessalonians-5-16-18",
    "theme": "gratitude",
    "group": "Gratitude",
    "reference": "1 Thessalonians 5:16-18",
    "text": "Rejoice always. Pray without ceasing. In everything give thanks, for this is the will of God in Christ Jesus toward you."
  },
  {
    "id": "psalm-100-4",
    "theme": "gratitude",
    "group": "Gratitude",
    "reference": "Psalm 100:4",
    "text": "Enter into his gates with thanksgiving, and into his courts with praise. Give thanks to him, and bless his name."
  },
  {
    "id": "colossians-3-15-17",
    "theme": "gratitude",
    "group": "Gratitude",
    "reference": "Colossians 3:15-17",
    "text": "And let the peace of God rule in your hearts, to which also you were called in one body, and be thankful. Let the word of Christ dwell in you richly; in all wisdom teaching and admonishing one another with psalms, hymns, and spiritual songs, singing with grace in your heart to the Lord. Whatever you do, in word or in deed, do all in the name of the Lord Jesus, giving thanks to God the Father through him."
  },
  {
    "id": "psalm-107-1",
    "theme": "gratitude",
    "group": "Gratitude",
    "reference": "Psalm 107:1",
    "text": "Give thanks to the Lord, for he is good, for his loving kindness endures forever."
  },
  {
    "id": "ephesians-4-31-32",
    "theme": "forgiveness",
    "group": "Forgiveness",
    "reference": "Ephesians 4:31-32",
    "text": "Let all bitterness, wrath, anger, outcry, and slander be put away from you, with all malice. Be kind to one another, tenderhearted, forgiving each other, just as God also in Christ forgave you."
  },
  {
    "id": "matthew-6-14-15",
    "theme": "forgiveness",
    "group": "Forgiveness",
    "reference": "Matthew 6:14-15",
    "text": "For if you forgive men their trespasses, your heavenly Father will also forgive you. But if you do not forgive men their trespasses, neither will your Father forgive your trespasses."
  },
  {
    "id": "colossians-3-13",
    "theme": "forgiveness",
    "group": "Forgiveness",
    "reference": "Colossians 3:13",
    "text": "bearing with one another, and forgiving each other, if any man has a complaint against any; even as Christ forgave you, so you also do."
  },
  {
    "id": "luke-6-37",
    "theme": "forgiveness",
    "group": "Forgiveness",
    "reference": "Luke 6:37",
    "text": "Don't judge, and you won't be judged. Don't condemn, and you won't be condemned. Set free, and you will be set free."
  },
  {
    "id": "philippians-2-3-4",
    "theme": "humility",
    "group": "Humility",
    "reference": "Philippians 2:3-4",
    "text": "doing nothing through rivalry or through conceit, but in humility, each counting others better than himself; each of you not just looking to his own things, but each of you also to the things of others."
  },
  {
    "id": "james-4-10",
    "theme": "humility",
    "group": "Humility",
    "reference": "James 4:10",
    "text": "Humble yourselves in the sight of the Lord, and he will exalt you."
  },
  {
    "id": "1-peter-5-5-6",
    "theme": "humility",
    "group": "Humility",
    "reference": "1 Peter 5:5-6",
    "text": "all of you clothe yourselves with humility, to subject yourselves to one another; for God resists the proud, but gives grace to the humble. Humble yourselves therefore under the mighty hand of God, that he may exalt you in due time."
  },
  {
    "id": "romans-5-3-5",
    "theme": "perseverance",
    "group": "Perseverance",
    "reference": "Romans 5:3-5",
    "text": "We also rejoice in our sufferings, knowing that suffering produces perseverance; and perseverance, proven character; and proven character, hope; and hope doesn't disappoint us, because God's love has been poured into our hearts through the Holy Spirit who was given to us."
  },
  {
    "id": "james-1-12",
    "theme": "perseverance",
    "group": "Perseverance",
    "reference": "James 1:12",
    "text": "Blessed is a person who endures temptation, for when he has been approved, he will receive the crown of life, which the Lord promised to those who love him."
  },
  {
    "id": "hebrews-12-1-2",
    "theme": "perseverance",
    "group": "Perseverance",
    "reference": "Hebrews 12:1-2",
    "text": "Therefore let us also, seeing we are surrounded by so great a cloud of witnesses, lay aside every weight and the sin which so easily entangles us, and let us run with perseverance the race that is set before us, looking to Jesus, the author and perfecter of faith."
  },
  {
    "id": "psalm-121-1-2",
    "theme": "encouragement",
    "group": "Encouragement",
    "reference": "Psalm 121:1-2",
    "text": "I will lift up my eyes to the hills. Where does my help come from? My help comes from the Lord, who made heaven and earth."
  },
  {
    "id": "romans-8-31",
    "theme": "encouragement",
    "group": "Encouragement",
    "reference": "Romans 8:31",
    "text": "What then shall we say about these things? If God is for us, who can be against us?"
  },
  {
    "id": "john-16-33",
    "theme": "encouragement",
    "group": "Encouragement",
    "reference": "John 16:33",
    "text": "In the world you have trouble; but cheer up! I have overcome the world."
  },
  {
    "id": "psalm-34-17-18",
    "theme": "encouragement",
    "group": "Encouragement",
    "reference": "Psalm 34:17-18",
    "text": "The righteous cry, and the Lord hears, and delivers them out of all their troubles. The Lord is near to those who have a broken heart, and saves those who have a crushed spirit."
  },
  {
    "id": "2-corinthians-12-9",
    "theme": "encouragement",
    "group": "Encouragement",
    "reference": "2 Corinthians 12:9",
    "text": "He has said to me, \"My grace is sufficient for you, for my power is made perfect in weakness.\""
  },
  {
    "id": "isaiah-43-2",
    "theme": "encouragement",
    "group": "Encouragement",
    "reference": "Isaiah 43:2",
    "text": "When you pass through the waters, I will be with you; and through the rivers, they will not overflow you. When you walk through the fire, you will not be burned."
  },
  {
    "id": "psalm-27-1",
    "theme": "encouragement",
    "group": "Encouragement",
    "reference": "Psalm 27:1",
    "text": "The Lord is my light and my salvation. Whom shall I fear? The Lord is the strength of my life. Of whom shall I be afraid?"
  },
  {
    "id": "mark-10-45",
    "theme": "serving",
    "group": "Serving Others",
    "reference": "Mark 10:45",
    "text": "For the Son of Man also came not to be served, but to serve, and to give his life as a ransom for many."
  },
  {
    "id": "galatians-5-13",
    "theme": "serving",
    "group": "Serving Others",
    "reference": "Galatians 5:13",
    "text": "through love be servants to one another."
  },
  {
    "id": "matthew-5-16",
    "theme": "serving",
    "group": "Serving Others",
    "reference": "Matthew 5:16",
    "text": "Even so, let your light shine before men, that they may see your good works and glorify your Father who is in heaven."
  },
  {
    "id": "1-peter-4-10",
    "theme": "serving",
    "group": "Serving Others",
    "reference": "1 Peter 4:10",
    "text": "As each has received a gift, employ it in serving one another, as good managers of the grace of God in its various forms."
  },
  {
    "id": "philippians-4-6",
    "theme": "prayer",
    "group": "Prayer",
    "reference": "Philippians 4:6",
    "text": "In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God."
  },
  {
    "id": "1-thessalonians-5-17",
    "theme": "prayer",
    "group": "Prayer",
    "reference": "1 Thessalonians 5:17",
    "text": "Pray without ceasing."
  },
  {
    "id": "jeremiah-33-3",
    "theme": "prayer",
    "group": "Prayer",
    "reference": "Jeremiah 33:3",
    "text": "Call to me, and I will answer you, and will show you great and difficult things, which you don't know."
  },
  {
    "id": "matthew-7-7",
    "theme": "prayer",
    "group": "Prayer",
    "reference": "Matthew 7:7",
    "text": "Ask, and it will be given you. Seek, and you will find. Knock, and it will be opened for you."
  },
  {
    "id": "2-corinthians-5-17",
    "theme": "identity",
    "group": "Identity in Christ",
    "reference": "2 Corinthians 5:17",
    "text": "Therefore if anyone is in Christ, he is a new creation. The old things have passed away. Behold, all things have become new."
  },
  {
    "id": "romans-8-1",
    "theme": "identity",
    "group": "Identity in Christ",
    "reference": "Romans 8:1",
    "text": "There is therefore now no condemnation to those who are in Christ Jesus."
  },
  {
    "id": "ephesians-2-10",
    "theme": "identity",
    "group": "Identity in Christ",
    "reference": "Ephesians 2:10",
    "text": "For we are his workmanship, created in Christ Jesus for good works, which God prepared before that we would walk in them."
  },
  {
    "id": "1-peter-2-9",
    "theme": "identity",
    "group": "Identity in Christ",
    "reference": "1 Peter 2:9",
    "text": "But you are a chosen race, a royal priesthood, a holy nation, a people for God's own possession, that you may proclaim the excellence of him who called you out of darkness into his marvelous light."
  },
  {
    "id": "galatians-2-20",
    "theme": "identity",
    "group": "Identity in Christ",
    "reference": "Galatians 2:20",
    "text": "I have been crucified with Christ, and it is no longer I who live, but Christ lives in me. That life which I now live in the flesh, I live by faith in the Son of God, who loved me and gave himself up for me."
  }
];
