// Store user's scores
let scores = {
    Discipline: 0,
    Wisdom: 0,
    Compassion: 0,
    Leadership: 0,
    Resilience: 0,
    Creativity: 0
};

// Function to add messages to the chat interface
function addMessage(speaker, text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', speaker);
    messageElement.textContent = text;
    document.getElementById('chatbox').appendChild(messageElement);

    // Auto-scroll to keep the most recent message visible
    document.getElementById('chatbox').scrollTop = document.getElementById('chatbox').scrollHeight;
}

// Typing dots to simulate thinking/typing from Kaladin
let typingInterval;
let typingDots = 0;

function showTypingDots() {
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('typing-indicator');
    typingIndicator.textContent = 'typing...';
    document.getElementById('chatbox').appendChild(typingIndicator);
    typingIndicator.style.display = 'inline';

    typingDots = 0;

    typingInterval = setInterval(() => {
        typingIndicator.textContent = '.'.repeat(typingDots % 5);
        typingDots++;
    }, 250);
}

function stopTypingDots() {
    clearInterval(typingInterval);
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Function to show choices (answer buttons)
function showChoices(choices) {
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = '';

    choices.forEach(choice => {
        const choiceButton = document.createElement('button');
        choiceButton.classList.add('choice-button');
        choiceButton.textContent = choice.text;
        choiceButton.onclick = () => handleChoice(choice.type, choice.type2, choice.type3, choice.weight, choice.id, choice.next);
        choicesContainer.appendChild(choiceButton);
    });
}

// intro conversation
let conversation = [
    {
        speaker: "kal",
        text: "Alright, before we start—name’s Kaladin. Just Kaladin. I’m not big on titles.",
        choices: [
            { id: 1, text: "Stormblessed?!", next: 2 },
            { id: 2, text: "Wow! Nice to meet you, Kaladin.", next: 2 }
        ]
    },
    {
        speaker: "kal",
        text: "Ha. Yeah. That’s me. Not sure what you’ve heard, but let’s just say I’m doing my best out here."
    },
    {
        speaker: "kal",
        text: "Alright, let's get this started. I know this isn’t exactly how you expected to be spending your time, but here we are. So, tell me... how’s your family doing since the occupation?",
        choices: [
            { id: 3, text: "It's been a tough time for all of us. Our understanding of the world’s been turned upside down.", next: 4 },
            { id: 4, text: "We're managing, but things are different now. Hard to know what normal even is anymore.", next: 4 }
        ]
    },
    {
        speaker: "kal",
        text: "I hear that. Things aren’t easy, especially when you realize how much we’ve been missing. But hey, we’ll work through this. We’ve got to understand who we are before we can move forward, right?"
    },
    {
        speaker: "kal",
        text: "I’m going to ask you some questions—nothing too personal, don't worry. But I need to get a feel for you, so I can help you find a path through this mess."
    },
    {
        speaker: "kal",
        text: "Ready? Let’s do this."
    }
];

// Question data
const quizQuestions = [
  {
    speaker: "kal",
    text: "So, tell me... when you're faced with a tough challenge, what's your first instinct?",
    choices: [
        { id: 1, text: "Plan and gather a strategy before acting.", type: "Discipline", weight: 2, next: 2, followUpText: ["Smart. A calculated approach avoids unnecessary risks."] },
        { id: 2, text: "Jump in headfirst and figure things out as I go.", type: "Creativity", weight: 2, next: 2, followUpText: ["Brave, but reckless. Not unfamiliar territory for me."] },
        { id: 3, text: "Help others, even if it means sacrificing my own time.", type: "Compassion", weight: 2, next: 2, followUpText: ["Putting others first... That’s a rare strength."] },
        { id: 4, text: "Look for a creative solution to solve the problem.", type: "Creativity", weight: 2, next: 2, followUpText: ["Creativity can solve problems that brute force can’t."] }
    ]
},
{
    speaker: "kal",
    text: "Rules are important, but there's always room for flexibility... How do you feel about structure and rules in your life?",
    choices: [
        { id: 1, text: "I believe rules are essential to maintain order and justice.", type: "Discipline", weight: 2, next: 3, followUpText: ["You’d get along with some people I know."] },
        { id: 2, text: "I think rules are important, but should be flexible.", type: "Wisdom", weight: 2, next: 3, followUpText: ["Compromise takes wisdom."] },
        { id: 3, text: "I prefer to go with the flow and break rules if necessary.", type: "Resilience", weight: 2, next: 3, followUpText: ["Freedom above all else, huh?"] },
        { id: 4, text: "Rules can be limiting, but I follow them when needed.", type: "Creativity", weight: 2, next: 3, followUpText: ["Practical. Not a bad mindset."] }
    ]
},
{
    speaker: "kal",
    text: "In any relationship, trust is key. What do you value most in your connections with others?",
    choices: [
        { id: 1, text: "Trust and loyalty above all else.", type: "Leadership", weight: 2, next: 4, followUpText: ["Loyalty... it’s everything."] },
        { id: 2, text: "Adventure and shared experiences.", type: "Resilience", weight: 2, next: 4, followUpText: ["Life’s more fun that way, isn’t it?"] },
        { id: 3, text: "Compassion and understanding.", type: "Compassion", weight: 2, next: 4, followUpText: ["The world needs more people like that."] },
        { id: 4, text: "Honesty and openness.", type: "Wisdom", weight: 2, next: 4, followUpText: ["No lies? That’s... refreshing."] }
    ]
},
{
    speaker: "kal",
    text: "Decision-making isn't always easy. How do you typically handle big decisions?",
    choices: [
        { id: 1, text: "I carefully analyze all options and make a logical choice.", type: "Wisdom", weight: 2, next: 5, followUpText: ["A rational approach. Makes sense."] },
        { id: 2, text: "I trust my gut and make quick decisions.", type: "Leadership", weight: 2, next: 5, followUpText: ["No hesitation. I respect that."] },
        { id: 3, text: "I consider how my decision will affect others before choosing.", type: "Compassion", weight: 2, next: 5, followUpText: ["Thinking of the bigger picture... Smart."] },
        { id: 4, text: "I weigh all options and consider the creative possibilities.", type: "Creativity", weight: 2, next: 5, followUpText: ["You see possibilities others might miss."] }
    ]
},
{
    speaker: "kal",
    text: "Leadership... it can be a burden. What's your approach to leading others?",
    choices: [
        { id: 1, text: "I lead by example and make sure everyone follows the rules.", type: "Discipline", weight: 2, next: 6, followUpText: ["Strict, but fair."] },
        { id: 2, text: "I inspire others to take action and figure things out themselves.", type: "Leadership", weight: 2, next: 6, followUpText: ["That sounds familiar..."] },
        { id: 3, text: "I look out for my people and make sure they’re okay, even if it means taking a backseat.", type: "Compassion", weight: 2, next: 6, followUpText: ["Caring without controlling. Not easy."] },
        { id: 4, text: "I encourage others to think outside the box and find innovative solutions.", type: "Creativity", weight: 2, next: 6, followUpText: ["Creativity can be leadership, too."] }
    ]
},
{
    speaker: "kal",
    text: "You ever been in the middle of a fight you didn't want to be in? Conflict has a way of finding us. How do you handle it?",
    choices: [
        { id: 1, text: "I confront the issue head-on and try to resolve it quickly.", type: "Resilience", weight: 2, next: 7, followUpText: ["No hesitation. I like that."] },
        { id: 2, text: "I try to stay calm and approach the conflict carefully.", type: "Wisdom", weight: 2, next: 7, followUpText: ["Patience can be a powerful tool."] },
        { id: 3, text: "I avoid conflict whenever possible, but will step in if others are hurt.", type: "Compassion", weight: 2, next: 7, followUpText: ["That’s a different kind of strength."] },
        { id: 4, text: "I find creative ways to resolve the issue without anyone feeling hurt.", type: "Creativity", weight: 2, next: 7, followUpText: ["Interesting approach."] }
    ]
},
{
    speaker: "kal",
    text: "I’ve seen too much injustice to stay quiet. When you see something wrong happening, what’s your first instinct?",
    choices: [
        { id: 1, text: "I stand up for what’s right and fight to make a change.", type: "Resilience", weight: 2, next: 8, followUpText: ["You’d be dangerous with a Shardblade."] },
        { id: 2, text: "I try to understand both sides and work toward a fair solution.", type: "Wisdom", weight: 2, next: 8, followUpText: ["Diplomatic. I respect that."] },
        { id: 3, text: "I may feel overwhelmed, but I will help where I can.", type: "Compassion", weight: 2, next: 8, followUpText: ["Sometimes even small efforts matter."] },
        { id: 4, text: "I think of an out of the box way about how I can change the situation.", type: "Creativity", weight: 2, next: 8, followUpText: ["Change starts with perspective."] }
    ]
},
{
    speaker: "kal",
    text: "Not everyone thrives in the same kind of environment. What kind of setting helps you do your best work?",
    choices: [
        { id: 1, text: "A structured environment where everything is organized.", type: "Discipline", weight: 2, next: 9, followUpText: ["Structure makes things more efficient."] },
        { id: 2, text: "A fast-paced environment where things are always changing.", type: "Creativity", weight: 1, next: 9, followUpText: ["Never a dull moment, huh?"] },
        { id: 3, text: "A calm, supportive environment where everyone works together.", type: "Compassion", weight: 2, next: 9, followUpText: ["Unity makes all the difference."] },
        { id: 4, text: "An environment that allows for freedom and creative thinking.", type: "Creativity", weight: 2, next: 9, followUpText: ["Letting creativity flow freely... I see the appeal."] }
    ]
},
{
    speaker: "kal",
    text: "Big tasks can feel overwhelming. What’s your strategy when tackling something huge?",
    choices: [
        { id: 1, text: "I break it down into smaller, manageable tasks.", type: "Discipline", weight: 2, next: 10, followUpText: ["Logical. That’s a solid method."] },
        { id: 2, text: "I dive right in and tackle the biggest part first.", type: "Resilience", weight: 2, next: 10, followUpText: ["Straight into the fire. I like it."] },
        { id: 3, text: "I make sure everyone is on the same page before proceeding.", type: "Wisdom", weight: 2, next: 10, followUpText: ["Good leadership starts with communication."] },
        { id: 4, text: "I come up with a unique angle or creative solution before starting.", type: "Creativity", weight: 2, next: 10, followUpText: ["A fresh perspective never hurts."] }
    ]
},
{
    speaker: "kal",
    text: "Life never goes as planned. When something unexpected happens, how do you handle it?",
    choices: [
        { id: 1, text: "I adapt quickly and make the necessary adjustments.", type: "Leadership", weight: 2, next: 11, followUpText: ["Rolling with the punches, huh?"] },
        { id: 2, text: "I may feel frustrated, but I find a way to work through it.", type: "Resilience", weight: 2, next: 11, followUpText: ["Stubborn resilience. I get it."] },
        { id: 3, text: "I make sure others are okay and help them adjust.", type: "Compassion", weight: 2, next: 11, followUpText: ["Looking out for others first. That’s rare."] },
        { id: 4, text: "I see it as an opportunity to try something new.", type: "Creativity", weight: 2, next: 11, followUpText: ["Creative minds thrive in chaos."] }
    ]
},
{
    speaker: "kal",
    text: "Not everyone wants to lead, but sometimes it falls on you anyway. When you're in a leadership role, how do you handle it?",
    choices: [
        { id: 1, text: "I lead by example and make sure everyone follows the rules.", type: "Wisdom", weight: 2, next: 12, followUpText: ["Discipline keeps things in order."] },
        { id: 2, text: "I inspire others to take action and figure things out themselves.", type: "Resilience", weight: 2, next: 12, followUpText: ["Sounds familiar..."] },
        { id: 3, text: "I look out for my people and make sure they’re okay, even if it means taking a backseat.", type: "Leadership", weight: 2, next: 12, followUpText: ["That’s a leader people trust."] },
        { id: 4, text: "I encourage others to think outside the box and find innovative solutions.", type: "Creativity", weight: 2, next: 12, followUpText: ["Creativity makes a strong leader, too."] }
    ]
},
{
    speaker: "kal",
    text: "Life is full of challenges—no avoiding that. What keeps you pushing forward when things get hard?",
    choices: [
        { id: 1, text: "A sense of duty and responsibility to those around me.", type: "Leadership", weight: 2, next: 13, followUpText: ["Yeah. I get that."] },
        { id: 2, text: "The excitement of tackling a challenge head-on.", type: "Resilience", weight: 2, next: 13, followUpText: ["Unshakable, huh? Impressive."] },
        { id: 3, text: "The ability to help others and make a positive impact.", type: "Compassion", weight: 2, next: 13, followUpText: ["Small kindnesses can change the world."] },
        { id: 4, text: "The chance to explore new possibilities.", type: "Creativity", weight: 2, next: 13, followUpText: ["Freedom to explore? I can see the appeal."] }
    ]
},
{
    speaker: "kal",
    text: "People see the world in different ways. What’s your perspective on truth?",
    choices: [
        { id: 1, text: "Truth is a foundation—unchanging and absolute.", type: "Discipline", weight: 2, next: 14, followUpText: ["Some things don’t bend."] },
        { id: 2, text: "Truth is important, but perspective matters too.", type: "Wisdom", weight: 2, next: 14, followUpText: ["Interesting take."] },
        { id: 3, text: "Truth is personal—everyone has their own version of it.", type: "Compassion", weight: 2, next: 14, followUpText: ["Some truths are harder to pin down."] },
        { id: 4, text: "Truth is something we discover as we grow.", type: "Resilience", weight: 2, next: 14, followUpText: ["Always searching for understanding, huh?"] }
    ]
},
{
    speaker: "kal",
    text: "Some people crave adventure, others prefer stability. Which sounds more like you?",
    choices: [
        { id: 1, text: "I like stability—I want to build something lasting.", type: "Leadership", weight: 2, next: 15, followUpText: ["That kind of reliability is rare."] },
        { id: 2, text: "I like a balance—some adventure, but with a strong foundation.", type: "Compassion", weight: 2, next: 15, followUpText: ["Finding harmony, huh?"] },
        { id: 3, text: "I thrive on change and new experiences.", type: "Resilience", weight: 2, next: 15, followUpText: ["You’d probably drive me crazy."] },
        { id: 4, text: "I go where I’m needed, wherever that may be.", type: "Leadership", weight: 2, next: 15, followUpText: ["No ties, huh?"] }
    ]
},
{
    speaker: "kal",
    text: "Finally, when everything's said and done, how do you want to be remembered?",
    choices: [
        { id: 1, text: "As someone who always did the right thing, no matter what.", type: "Discipline", weight: 2, next: 16, followUpText: ["Your sense of honor will be your legacy."] },
        { id: 2, text: "As someone who made a difference by pushing boundaries and challenging the norm.", type: "Leadership", weight: 2, next: 16, followUpText: ["You’ll be remembered for your bravery."] },
        { id: 3, text: "As someone who made the world a better place, one small act of kindness at a time.", type: "Compassion", weight: 2, next: 16, followUpText: ["Kindness never goes unnoticed."] },
        { id: 4, text: "As someone who inspired others to think different.", type: "Creativity", weight: 2, next: 16, followUpText: ["You’ll leave your mark on the world."] }
    ]
}
];

// Function to handle choices selected by the user
function handleChoice(type, weight, id, next) {
    // Update scores based on the user's choice
    scores[type] += weight;

    // Show a follow-up comment if available
    const followUpText = questions[id - 1].choices.find(choice => choice.id === id).followUpText;
    if (followUpText.length > 0) {
        followUpText.forEach(text => addMessage('kal', text));
    }

    // Display the next question after a small delay to simulate thinking/typing
    showTypingDots();
    setTimeout(() => {
        stopTypingDots();
        showNextQuestion(next);
    }, 2000);
}

// Function to display the next question
function showNextQuestion(next) {
    const question = questions[next - 1]; // Get the next question based on the 'next' value
    addMessage('kal', question.text); // Kaladin speaks
    showChoices(question.choices); // Display answer choices
}

// Function to determine the Radiant Order based on top traits
function displayResult() {
    // Sort traits by score
    const sortedTraits = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topThreeTraits = sortedTraits.slice(0, 3).map(([trait]) => trait);

    // Radiant Order Key
    const radiantOrders = {
        'Windrunner': { traits: ['Leadership', 'Discipline', 'Compassion'], tagline: 'I will protect', description: 'Windrunners are warriors and protectors, always ready to stand between danger and those who cannot defend themselves.' },
        'Skybreaker': { traits: ['Discipline', 'Wisdom', 'Resilience'], tagline: 'I will seek justice', description: 'Skybreakers uphold the law above all, ensuring justice is served, even when the choices are difficult.' },
        'Stoneward': { traits: ['Resilience', 'Compassion', 'Wisdom'], tagline: 'I will be there when I’m needed', description: 'Stonewards are steadfast and reliable, standing strong no matter the odds.' },
        'Edgedancer': { traits: ['Compassion', 'Resilience', 'Creativity'], tagline: 'I will remember', description: 'Edgedancers care deeply for the overlooked, ensuring no one is forgotten or left behind.' },
        'Truthwatcher': { traits: ['Wisdom', 'Compassion', 'Creativity'], tagline: 'I will seek truth', description: 'Truthwatchers are insightful and intuitive, seeking deeper truths and understanding the unseen.' },
        'Lightweaver': { traits: ['Creativity', 'Leadership', 'Compassion'], tagline: 'I will speak my truth', description: 'Lightweavers are artists and storytellers, unafraid to reveal uncomfortable truths and express emotions freely.' },
        'Elsecaller': { traits: ['Wisdom', 'Discipline', 'Leadership'], tagline: 'I will reach my potential', description: 'Elsecallers strive for self-improvement and understanding, always seeking greater knowledge and refinement.' },
        'Willshaper': { traits: ['Creativity', 'Wisdom', 'Resilience'], tagline: 'I will seek freedom', description: 'Willshapers are free spirits who seek adventure, change, and the breaking of unnecessary restrictions.' },
        'Bondsmith': { traits: ['Leadership', 'Wisdom', 'Compassion'], tagline: 'I will unite', description: 'Bondsmiths are leaders and peacemakers, forging connections between people and bringing them together.' },
        'Dustbringer': { traits: ['Discipline', 'Wisdom', 'Creativity'], tagline: 'I will seek self-mastery', description: 'Dustbringers value self-control and personal growth, striving for mastery over themselves and their abilities.' }
    };

    // Find the best match
    let bestMatch = '';
    let maxMatches = 0;
    for (const [order, data] of Object.entries(radiantOrders)) {
        const matches = data.traits.filter(trait => topThreeTraits.includes(trait)).length;
        if (matches > maxMatches) {
            maxMatches = matches;
            bestMatch = order;
        }
    }

    // Display result
    if (bestMatch) {
        const { tagline, description } = radiantOrders[bestMatch];
        addMessage('kal', `Based on your answers, your Radiant Order is: ${bestMatch}.`);
        addMessage('kal', `Tagline: ${tagline}`);
        addMessage('kal', `Description: ${description}`);
    }
}
