import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const verses = [
  ['love', 'Fruits of the Spirit', '1 Corinthians 13:4-8', "Love is patient and is kind. Love does not envy. Love does not brag, is not proud, does not behave itself inappropriately, does not seek its own way, is not provoked, takes no account of evil; does not rejoice in unrighteousness, but rejoices with the truth; bears all things, believes all things, hopes all things, endures all things. Love never fails. But where there are prophecies, they will be done away with. Where there are various languages, they will cease. Where there is knowledge, it will be done away with."],
  ['love', 'Fruits of the Spirit', 'John 13:34-35', 'A new commandment I give to you, that you love one another. Just as I have loved you, you also love one another. By this everyone will know that you are my disciples, if you have love for one another.'],
  ['love', 'Fruits of the Spirit', '1 John 4:7-8', 'Beloved, let us love one another, for love is of God; and everyone who loves has been born of God and knows God. He who does not love does not know God, for God is love.'],
  ['love', 'Fruits of the Spirit', 'Romans 12:9-10', 'Let love be without hypocrisy. Abhor that which is evil. Cling to that which is good. In love of the brothers be tenderly affectionate to one another; in honor preferring one another.'],
  ['love', 'Fruits of the Spirit', 'Colossians 3:14', 'Above all these things, walk in love, which is the bond of perfection.'],
  ['love', 'Fruits of the Spirit', 'Ephesians 5:1-2', 'Be therefore imitators of God, as beloved children. Walk in love, even as Christ also loved us and gave himself up for us, an offering and a sacrifice to God for a sweet-smelling fragrance.'],
  ['joy', 'Fruits of the Spirit', 'Nehemiah 8:10', 'Then he said to them, "Go your way. Eat the fat, drink the sweet, and send portions to him for whom nothing is prepared, for today is holy to our Lord. Do not be grieved, for the joy of the Lord is your strength."'],
  ['joy', 'Fruits of the Spirit', 'Philippians 4:4', 'Rejoice in the Lord always! Again I will say, "Rejoice!"'],
  ['joy', 'Fruits of the Spirit', 'Psalm 16:11', 'You will show me the path of life. In your presence is fullness of joy. In your right hand there are pleasures forever more.'],
  ['joy', 'Fruits of the Spirit', 'Romans 15:13', 'Now may the God of hope fill you with all joy and peace in believing, that you may abound in hope in the power of the Holy Spirit.'],
  ['joy', 'Fruits of the Spirit', 'James 1:2-3', 'Count it all joy, my brothers, when you fall into various temptations, knowing that the testing of your faith produces endurance.'],
  ['peace', 'Fruits of the Spirit', 'John 14:27', 'Peace I leave with you. My peace I give to you; not as the world gives, I give to you. Do not let your heart be troubled, neither let it be fearful.'],
  ['peace', 'Fruits of the Spirit', 'Philippians 4:6-7', 'In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.'],
  ['peace', 'Fruits of the Spirit', 'Isaiah 26:3', "You will keep whoever's mind is steadfast in perfect peace, because he trusts in you."],
  ['peace', 'Fruits of the Spirit', 'Romans 5:1', 'Being therefore justified by faith, we have peace with God through our Lord Jesus Christ.'],
  ['peace', 'Fruits of the Spirit', 'Colossians 3:15', 'And let the peace of God rule in your hearts, to which also you were called in one body, and be thankful.'],
  ['patience', 'Fruits of the Spirit', 'James 5:7-8', 'Be patient therefore, brothers, until the coming of the Lord. Behold, the farmer waits for the precious fruit of the earth, being patient over it, until it receives the early and late rain. You also be patient. Establish your hearts, for the coming of the Lord is at hand.'],
  ['patience', 'Fruits of the Spirit', 'Romans 12:12', 'Rejoicing in hope, enduring in troubles, continuing steadfastly in prayer.'],
  ['patience', 'Fruits of the Spirit', 'Ephesians 4:2', 'with all lowliness and humility, with patience, bearing with one another in love.'],
  ['patience', 'Fruits of the Spirit', 'Colossians 3:12', "Put on therefore, as God's chosen ones, holy and beloved, a heart of compassion, kindness, lowliness, humility, and perseverance."],
  ['kindness', 'Fruits of the Spirit', 'Ephesians 4:32', 'And be kind to one another, tenderhearted, forgiving each other, just as God also in Christ forgave you.'],
  ['kindness', 'Fruits of the Spirit', 'Proverbs 11:17', 'The merciful man does good to his own soul, but he who is cruel troubles his own flesh.'],
  ['kindness', 'Fruits of the Spirit', 'Luke 6:35', 'But love your enemies, and do good, and lend, expecting nothing back; and your reward will be great, and you will be children of the Most High; for he is kind toward the unthankful and evil.'],
  ['kindness', 'Fruits of the Spirit', 'Micah 6:8', 'He has shown you, O man, what is good. What does the Lord require of you, but to act justly, to love mercy, and to walk humbly with your God?'],
  ['goodness', 'Fruits of the Spirit', 'Psalm 23:6', "Surely goodness and loving kindness shall follow me all the days of my life, and I will dwell in the Lord's house forever."],
  ['goodness', 'Fruits of the Spirit', 'Galatians 6:9', "Let's not be weary in doing good, for we will reap in due season if we don't give up."],
  ['goodness', 'Fruits of the Spirit', 'Romans 12:21', "Don't be overcome by evil, but overcome evil with good."],
  ['goodness', 'Fruits of the Spirit', 'Titus 3:8', 'This saying is faithful, and concerning these things I desire that you affirm confidently, so that those who have believed God may be careful to maintain good works. These things are good and profitable to men.'],
  ['faithfulness', 'Fruits of the Spirit', 'Proverbs 3:3-4', "Don't let kindness and truth forsake you. Bind them around your neck. Write them on the tablet of your heart. So you will find favor, and good understanding in the sight of God and man."],
  ['faithfulness', 'Fruits of the Spirit', 'Lamentations 3:22-23', "It is because of the Lord's loving kindnesses that we are not consumed, because his compassion doesn't fail. They are new every morning. Great is your faithfulness."],
  ['faithfulness', 'Fruits of the Spirit', 'Hebrews 10:23', "Let's hold fast the confession of our hope without wavering; for he who promised is faithful."],
  ['faithfulness', 'Fruits of the Spirit', 'Matthew 25:21', "His lord said to him, 'Well done, good and faithful servant. You have been faithful over a few things. I will set you over many things. Enter into your lord's joy.'"],
  ['gentleness', 'Fruits of the Spirit', 'Philippians 4:5', 'Let your gentleness be known to all men. The Lord is at hand.'],
  ['gentleness', 'Fruits of the Spirit', 'Proverbs 15:1', 'A gentle answer turns away wrath, but a harsh word stirs up anger.'],
  ['gentleness', 'Fruits of the Spirit', 'Galatians 6:1', "Brothers, even if a man is caught in some fault, you who are spiritual must restore such a one in a spirit of gentleness; looking to yourself so that you also aren't tempted."],
  ['gentleness', 'Fruits of the Spirit', '1 Peter 3:15', 'But sanctify the Lord God in your hearts. Always be ready to give an answer to everyone who asks you a reason concerning the hope that is in you, with humility and fear.'],
  ['self-control', 'Fruits of the Spirit', '2 Timothy 1:7', "For God didn't give us a spirit of fear, but of power, love, and self-control."],
  ['self-control', 'Fruits of the Spirit', 'Proverbs 25:28', 'He whose spirit is without restraint is like a city that is broken down and without walls.'],
  ['self-control', 'Fruits of the Spirit', '1 Corinthians 9:24-27', "Don't you know that those who run in a race all run, but one receives the prize? Run like that, that you may win. Everyone who strives in the games exercises self-control in all things. I therefore run like that, not as uncertainty. I fight like that, not as beating the air, but I beat my body and bring it into submission, lest by any means, after I have preached to others, I myself should be rejected."],
  ['self-control', 'Fruits of the Spirit', 'Titus 2:11-12', 'For the grace of God has appeared, bringing salvation to all men, instructing us to the intent that, denying ungodliness and worldly lusts, we would live soberly, righteously, and godly in this present age.'],
  ['faith', 'Faith', 'Hebrews 11:1', 'Now faith is assurance of things hoped for, proof of things not seen.'],
  ['faith', 'Faith', 'Mark 9:23', 'Jesus said to him, "If you can believe, all things are possible to him who believes."'],
  ['faith', 'Faith', 'Matthew 17:20', 'If you have faith as a grain of mustard seed, you will tell this mountain, "Move from here to there," and it will move; and nothing will be impossible for you.'],
  ['faith', 'Faith', 'Romans 10:17', 'So faith comes by hearing, and hearing by the word of God.'],
  ['faith', 'Faith', '2 Corinthians 5:7', 'for we walk by faith, not by sight.'],
  ['faith', 'Faith', 'James 2:17', 'Even so faith, if it has no works, is dead in itself.'],
  ['faith', 'Faith', 'Hebrews 11:6', 'Without faith it is impossible to be well pleasing to him, for he who comes to God must believe that he exists, and that he is a rewarder of those who seek him.'],
  ['strength', 'Strength & Courage', 'Joshua 1:9', "Haven't I commanded you? Be strong and courageous. Don't be afraid. Don't be dismayed, for the Lord your God is with you wherever you go."],
  ['strength', 'Strength & Courage', 'Isaiah 41:10', "Don't you be afraid, for I am with you. Don't be dismayed, for I am your God. I will strengthen you. Yes, I will help you. Yes, I will uphold you with the right hand of my righteousness."],
  ['strength', 'Strength & Courage', 'Philippians 4:13', 'I can do all things through Christ who strengthens me.'],
  ['strength', 'Strength & Courage', 'Psalm 46:1', 'God is our refuge and strength, a very present help in trouble.'],
  ['strength', 'Strength & Courage', 'Isaiah 40:31', 'But those who wait for the Lord will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.'],
  ['strength', 'Strength & Courage', 'Deuteronomy 31:6', 'Be strong and courageous. Do not be afraid or scared, for the Lord your God himself is who goes with you. He will not fail you nor forsake you.'],
  ['hope', 'Hope', 'Jeremiah 29:11', 'For I know the thoughts that I think toward you, says the Lord, thoughts of peace, and not of evil, to give you hope and a future.'],
  ['hope', 'Hope', 'Psalm 42:11', 'Why are you in despair, my soul? Why are you disturbed within me? Hope in God! For I shall still praise him, the saving help of my countenance, and my God.'],
  ['hope', 'Hope', 'Hebrews 6:19', 'This hope we have as an anchor of the soul, a hope both sure and steadfast.'],
  ['hope', 'Hope', 'Romans 8:28', 'We know that all things work together for good for those who love God, to those who are called according to his purpose.'],
  ['trust', 'Trust', 'Proverbs 3:5-6', "Trust in the Lord with all your heart, and don't lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight."],
  ['trust', 'Trust', 'Psalm 37:5', 'Commit your way to the Lord. Trust also in him, and he will do this.'],
  ['trust', 'Trust', 'Psalm 56:3', 'When I am afraid, I will put my trust in you.'],
  ['trust', 'Trust', 'Isaiah 26:4', 'Trust in the Lord forever; for in the Lord, the Lord, is an everlasting Rock.'],
  ['wisdom', 'Wisdom', 'James 1:5', 'But if any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach, and it will be given to him.'],
  ['wisdom', 'Wisdom', 'Proverbs 9:10', 'The fear of the Lord is the beginning of wisdom. The knowledge of the Holy One is understanding.'],
  ['wisdom', 'Wisdom', 'Proverbs 2:6', 'For the Lord gives wisdom. Out of his mouth comes knowledge and understanding.'],
  ['wisdom', 'Wisdom', 'Ecclesiastes 7:12', 'For wisdom is a defense, even as money is a defense; but the excellency of knowledge is that wisdom preserves the life of him who has it.'],
  ['discipline', 'Discipline', 'Hebrews 12:11', 'All chastening seems for the present to be not joyous but grievous; yet afterward it yields the peaceful fruit of righteousness to those who have been exercised thereby.'],
  ['discipline', 'Discipline', 'Proverbs 12:1', 'Whoever loves correction loves knowledge, but he who hates reproof is stupid.'],
  ['discipline', 'Discipline', 'Proverbs 13:24', 'One who spares the rod hates his son, but one who loves him is careful to discipline him.'],
  ['discipline', 'Discipline', '1 Corinthians 9:27', 'But I beat my body and bring it into submission, lest by any means, after I have preached to others, I myself should be rejected.'],
  ['gratitude', 'Gratitude', '1 Thessalonians 5:16-18', 'Rejoice always. Pray without ceasing. In everything give thanks, for this is the will of God in Christ Jesus toward you.'],
  ['gratitude', 'Gratitude', 'Psalm 100:4', 'Enter into his gates with thanksgiving, and into his courts with praise. Give thanks to him, and bless his name.'],
  ['gratitude', 'Gratitude', 'Colossians 3:15-17', 'And let the peace of God rule in your hearts, to which also you were called in one body, and be thankful. Let the word of Christ dwell in you richly; in all wisdom teaching and admonishing one another with psalms, hymns, and spiritual songs, singing with grace in your heart to the Lord. Whatever you do, in word or in deed, do all in the name of the Lord Jesus, giving thanks to God the Father through him.'],
  ['gratitude', 'Gratitude', 'Psalm 107:1', 'Give thanks to the Lord, for he is good, for his loving kindness endures forever.'],
  ['forgiveness', 'Forgiveness', 'Ephesians 4:31-32', 'Let all bitterness, wrath, anger, outcry, and slander be put away from you, with all malice. Be kind to one another, tenderhearted, forgiving each other, just as God also in Christ forgave you.'],
  ['forgiveness', 'Forgiveness', 'Matthew 6:14-15', 'For if you forgive men their trespasses, your heavenly Father will also forgive you. But if you do not forgive men their trespasses, neither will your Father forgive your trespasses.'],
  ['forgiveness', 'Forgiveness', 'Colossians 3:13', 'bearing with one another, and forgiving each other, if any man has a complaint against any; even as Christ forgave you, so you also do.'],
  ['forgiveness', 'Forgiveness', 'Luke 6:37', "Don't judge, and you won't be judged. Don't condemn, and you won't be condemned. Set free, and you will be set free."],
  ['humility', 'Humility', 'Philippians 2:3-4', 'doing nothing through rivalry or through conceit, but in humility, each counting others better than himself; each of you not just looking to his own things, but each of you also to the things of others.'],
  ['humility', 'Humility', 'James 4:10', 'Humble yourselves in the sight of the Lord, and he will exalt you.'],
  ['humility', 'Humility', '1 Peter 5:5-6', 'all of you clothe yourselves with humility, to subject yourselves to one another; for God resists the proud, but gives grace to the humble. Humble yourselves therefore under the mighty hand of God, that he may exalt you in due time.'],
  ['perseverance', 'Perseverance', 'Romans 5:3-5', "We also rejoice in our sufferings, knowing that suffering produces perseverance; and perseverance, proven character; and proven character, hope; and hope doesn't disappoint us, because God's love has been poured into our hearts through the Holy Spirit who was given to us."],
  ['perseverance', 'Perseverance', 'James 1:12', 'Blessed is a person who endures temptation, for when he has been approved, he will receive the crown of life, which the Lord promised to those who love him.'],
  ['perseverance', 'Perseverance', 'Hebrews 12:1-2', 'Therefore let us also, seeing we are surrounded by so great a cloud of witnesses, lay aside every weight and the sin which so easily entangles us, and let us run with perseverance the race that is set before us, looking to Jesus, the author and perfecter of faith.'],
  ['encouragement', 'Encouragement', 'Psalm 121:1-2', 'I will lift up my eyes to the hills. Where does my help come from? My help comes from the Lord, who made heaven and earth.'],
  ['encouragement', 'Encouragement', 'Romans 8:31', 'What then shall we say about these things? If God is for us, who can be against us?'],
  ['encouragement', 'Encouragement', 'John 16:33', 'In the world you have trouble; but cheer up! I have overcome the world.'],
  ['encouragement', 'Encouragement', 'Psalm 34:17-18', 'The righteous cry, and the Lord hears, and delivers them out of all their troubles. The Lord is near to those who have a broken heart, and saves those who have a crushed spirit.'],
  ['encouragement', 'Encouragement', '2 Corinthians 12:9', 'He has said to me, "My grace is sufficient for you, for my power is made perfect in weakness."'],
  ['encouragement', 'Encouragement', 'Isaiah 43:2', 'When you pass through the waters, I will be with you; and through the rivers, they will not overflow you. When you walk through the fire, you will not be burned.'],
  ['encouragement', 'Encouragement', 'Psalm 27:1', 'The Lord is my light and my salvation. Whom shall I fear? The Lord is the strength of my life. Of whom shall I be afraid?'],
  ['serving', 'Serving Others', 'Mark 10:45', 'For the Son of Man also came not to be served, but to serve, and to give his life as a ransom for many.'],
  ['serving', 'Serving Others', 'Galatians 5:13', 'through love be servants to one another.'],
  ['serving', 'Serving Others', 'Matthew 5:16', 'Even so, let your light shine before men, that they may see your good works and glorify your Father who is in heaven.'],
  ['serving', 'Serving Others', '1 Peter 4:10', 'As each has received a gift, employ it in serving one another, as good managers of the grace of God in its various forms.'],
  ['prayer', 'Prayer', 'Philippians 4:6', 'In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God.'],
  ['prayer', 'Prayer', '1 Thessalonians 5:17', 'Pray without ceasing.'],
  ['prayer', 'Prayer', 'Jeremiah 33:3', "Call to me, and I will answer you, and will show you great and difficult things, which you don't know."],
  ['prayer', 'Prayer', 'Matthew 7:7', 'Ask, and it will be given you. Seek, and you will find. Knock, and it will be opened for you.'],
  ['identity', 'Identity in Christ', '2 Corinthians 5:17', 'Therefore if anyone is in Christ, he is a new creation. The old things have passed away. Behold, all things have become new.'],
  ['identity', 'Identity in Christ', 'Romans 8:1', 'There is therefore now no condemnation to those who are in Christ Jesus.'],
  ['identity', 'Identity in Christ', 'Ephesians 2:10', 'For we are his workmanship, created in Christ Jesus for good works, which God prepared before that we would walk in them.'],
  ['identity', 'Identity in Christ', '1 Peter 2:9', 'But you are a chosen race, a royal priesthood, a holy nation, a people for God\'s own possession, that you may proclaim the excellence of him who called you out of darkness into his marvelous light.'],
  ['identity', 'Identity in Christ', 'Galatians 2:20', 'I have been crucified with Christ, and it is no longer I who live, but Christ lives in me. That life which I now live in the flesh, I live by faith in the Son of God, who loved me and gave himself up for me.'],
];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const items = verses.map(([theme, group, reference, text]) => ({
  id: slug(reference),
  theme,
  group,
  reference,
  text,
}));

const themes = [...new Set(verses.map((v) => v[0]))];

const labels = {
  love: 'Love',
  joy: 'Joy',
  peace: 'Peace',
  patience: 'Patience',
  kindness: 'Kindness',
  goodness: 'Goodness',
  faithfulness: 'Faithfulness',
  gentleness: 'Gentleness',
  'self-control': 'Self-Control',
  faith: 'Faith',
  strength: 'Strength & Courage',
  hope: 'Hope',
  trust: 'Trust',
  wisdom: 'Wisdom',
  discipline: 'Discipline',
  gratitude: 'Gratitude',
  forgiveness: 'Forgiveness',
  humility: 'Humility',
  perseverance: 'Perseverance',
  encouragement: 'Encouragement',
  serving: 'Serving Others',
  prayer: 'Prayer',
  identity: 'Identity in Christ',
};

const themeUnion = themes.map((t) => `'${t}'`).join(' | ');

const out = `export type ScriptureTheme = ${themeUnion};

export interface ScriptureVerse {
  id: string;
  reference: string;
  text: string;
  theme: ScriptureTheme;
  group: string;
}

export const SCRIPTURE_THEME_LABELS: Record<ScriptureTheme, string> = ${JSON.stringify(labels, null, 2)} as Record<ScriptureTheme, string>;

export const SCRIPTURE_VERSES: ScriptureVerse[] = ${JSON.stringify(items, null, 2)};
`;

const target = path.join(__dirname, '..', 'lib', 'scripture-verses.ts');
fs.writeFileSync(target, out);
console.log('Wrote', items.length, 'verses to', target);
