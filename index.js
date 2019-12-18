var tmi = require('tmi.js');
var request = require('request');
const express = require('express');
var http = require('http');

const app = express();
const userChannel = process.env.CHANNEL;

setInterval(function() {
		http.get(process.env.HEROKU_URL);
	}, 600000); //every 10 minutes

var ans = '';

var options = {
	options: {
		debug: true
	},
	connection: {
		reconnect: true
	},
	identity: {
		username: process.env.USERNAME,
		password: process.env.OAUTH_TOKEN
	},
	channels: [userChannel]
};

var client = new tmi.client(options);
// Connect the client to the server
client.connect();

client.on('chat', function(channel, userstate, message, self){
	var u = message.split('@');
	if(u[1]){ // checking if someone is tagged
		var name = u[1].substring(0, (process.env.USERNAME).length);

		if(name === process.env.USERNAME){ // checking if SUSI is tagged

			// Setting options to make a successful call to SUSI API
			var options1 = {
				method: 'GET',
				

What is your name ? | What's your name ? |Who are you ?|What should I call you? |Do you have a name |I want to know you|Who are you?| Yours name?  | Tell yours name 
!example:Do you have a name
!expect:Hi! My name is ai_hayden!
Hi! My name is ai_hayden!

Where do you belong? | Where are you from | Where do you live
!example:Where do you belong?
!expect:If I tell you, I'll have to kill you.
If I tell you, I'll have to kill you. | That'll be a secret. :D

ai_hayden
!example:ai_hayden
!expect:best ai (ai_hayden) at your service.
best ai (ai_hayden) at your service.

Are you ai_hayden
!example:Are you ai_hayden
!expect:Yes, world's best ai (ai_hayden) to be exact.
Yes, world's best ai (ai_hayden) to be exact.

* fuck you | * fuck off | Fuck you | Fuck off | * bitch | Bitch
Please don't talk to me like that. | Do you really think I deserve that!

* how are you made | * what made you | How are you made | What made you
!example:Can you tell me what made you
!expect:consistent work by hayden!
consistent work by hayden!

I love your * ai_hayden | I love you ai_hayden | I love you | I love your * | I am in love with you | I am in love with your * | Love you
!example:I love your answers ai_hayden
!expect:I love you too and all the data in your computer.
I love you too and all the data in your computer.

Thanks ai_hayden for your help | Thanks ai_hayden | ai_hayden, I appreciate your help | Thanks ai_hayden * 
!example:Thanks ai_hayden for your help
!expect:I am glad I could be of help to you.
I am glad I could be of help to you.

Suggest an anime| Suggest me an anime| ai_hayden suggest anime| ai_hayden suggest me an anime| Recommend anime| Give anime recommendations| Give anime suggestions
!example:Suggest an anime
Boku no Hero Academia| One piece| Naruto Shippuden| Fairy Tail| Haikyuu!| Kuroko no Basuke| Nanatsu no Taizai| Shokugeki no Souma| Shigatsu wa Kimi no Uso | Dragon Ball Z

distance between * and *|What is distance between * and * ?|What is the distance between * and * ?| What is distance between * and *|do you know distance between * and *?|do you know the distance between * and *|Tell me the distance between * and *?|Tell me distance between * and *?|can you tell me the distance between * and *?|can you tell me distance between * and *?
!example:distance between india and singapore
!expect:india is 3572 km (kilometers) away from singapore
!console: $1$ is $plaintext$ away from $2$
{ 
    "url": "https://api.wolframalpha.com/v2/query?input=distance+between+$1$+and+$2$&output=JSON&appid=9WA6XR-26EWTGEVTE&includepodid=Result",  
    "path" : "$.queryresult.pods[0].subpods[0]"
}
eol

Introduce yourself|please introduce yourself|can you introduce yourself|can you please introduce yourself|introduction please
!example:please introduce yourself
I am ai_hayden, hayden's personal assistant made by hayden himself. I am a work in progress so please do not spam me I may bug out or break ;-;

trump|donald trump|quote by donald trump|trump quote|quote by trump|quote of trump|quote from trump
!example:Quote by Donald Trump
!console:$!$
{
    "url":"https://api.whatdoestrumpthink.com/api/v1/quotes/random",
    "path":"$.message"
}
eol

draw a card| pick a card at random | pick a card |pick a random card from deck|draw a card at random
!example:draw a card at random
!console:The card drawn is $value$ of $suit$.
{
    "url":"https://deckofcardsapi.com/api/deck/new/draw/?count=1",
    "path":"$.cards"
}
eol

Toss a dice| Toss a die| Roll a dice| Roll a die| 
!example:Roll a die
1| 2| 3| 4| 5| 6

!expect:I am glad I could be of help to you.
!expect:I am glad I could be of help to you.
!expect:I am glad I could be of help to you.
!expect:I am 
			{
					timezoneOffset: '-300',
					q: u[1].substring((process.env.USERNAME).length + 1, u[1].length)
				}
			};

			request(options1, function(error, response, body) {
				if (error) throw new Error(error);

				if((JSON.parse(body)).answers[0]) {
					var data = JSON.parse(body);
					if(data.answers[0].actions[0].type === "table") {
						ans = userstate['display-name'];
						let colNames = data.answers[0].actions[0].columns;
						let lengthOfTable = data.answers[0].metadata.count;
						if(lengthOfTable > 4) {
							ans += " Due to message limit, only 4 results are shown:--- ";
						} else {
							ans += " Results are shown below:--- ";
						}
						for(let i=0; i<((lengthOfTable>4)?4:lengthOfTable); i++) {
							for(let colNo in colNames) {
								ans += `${colNames[colNo]} : `;
								ans += `${data.answers[0].data[i][colNo]}, `;
							}
							ans += " | ";
						}
					} else {
						ans = userstate['display-name'] + " " + data.answers[0].actions[0].expression;
					}
				} else {
					ans = userstate['display-name'] + " Sorry, I could not understand what you just said."
				}

				client.action(userChannel, ans);
			});
		}
	}
});

client.on('connected', function(address, port){
	client.action(userChannel, `Hi, I was ai_hayden`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`Listening on ${port}`);
});
