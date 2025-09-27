const question_list = new Map();
const manager_choices = [];
buildQuestionList();
buildManagerChoices();

function buildQuestionList(){
	let manager_question = {
		next_if_yes: "manager_experience",
		next_if_no: "milb_manager"
	};

	let milb_question = {
		question: "Do you want your next manager to have Minor League managerial experience?",
		answers: ["Yes","No","Don't Care"],
		next: "coach"
	};

	let manager_experience = {
		question: "How many years experience should your next manager have as a manager?",
		answers: ["At least 1","At least 3","At least 6","At least 11","15 or more"],
		next: "win_percentage"
	};

	let winning_percentage = {
		question: "What's the minimum win percentage they should have as a manager?",
		answers: [".400", ".425", ".450", ".475", ".500", ".525"],
		next: "manager_of_the_year"
	};

	let moty_question = {
		question: "Do you want your next manager to have won AL or NL Manager of the Year before?",
		answers: ["Yes","No","Don't Care"],
		next: "coach"
	};

	let coach_question = {
		question: "Do you want your next manager to have coaching experience?",
		answers: ["Yes","No","Don't Care"],
		next_if_yes: "coach_experience",
		next_if_no: "age"
	};

	let coach_experience = {
		question: "How many years of experience should your next manager have as a coach?",
		answers: ["At least 1","At least 4","At least 6", "At least 8", "At least 11", "15 or more"],
		next: "highest_coach_level"
	};

	let highest_coach_level = {
		question: "What is the highest level of coaching you want your next manager to have achieved?",
		extra_text: "Below are in order of best to worst title by my estimation",
		answers: ["Manager", "Bench Coach", "Associate Manager", "Hitting/Pitching Coach", "Base Coach", "Position Coach", "Assistant Coach"],
		next: "age"
	};

	let age = {
		question: "How old should your next manager be?",
		answers: ["35-45","46-56","57-68", "68+"],
		next: "former_player"
	};

	let former_player = {
		question: "Should your next manager have played in MLB?",
		answers: ["Yes", "No", "Don't Care"],
		next: "hitting_or_pitching"
	};

	let hitting_or_pitching = {
		question: "Should your next manager have a background primarily in hitting or pitching?",
		answers: ["Hitting", "Pitching", "Don't Care"],
		next: "player_dev"
	};

	let player_dev = {
		question: "Should your next manager have experience in player development?",
		extra_text: "Front office player development, minor league manager/coach, roving instructor, etc.",
		answers: ["Yes", "No", "Don't Care"],
		next: "top_orgs"
	};

	let top_orgs = {
		question: "Should your next manager have been at one of the teams that appears in <a href='https://www.nytimes.com/athletic/6273808/2025/04/16/mlb-top-10-front-offices-executive-vote/' target='_blank'>The Athletic Top 10 Front Offices</a> in their last job?",
		answers: ["Yes", "No", "Don't Care"],
		next: "made_playoffs"
	};

	let made_playoffs = {
		question: "Should your next manager have made the playoffs as a coach or manager before?",
		extra_text:"For previous managers, only their managerial record counts here.",
		answers: ["Yes", "No", "Don't Care"],
		next_if_yes: "won_pennant",
		next_if_no:"nats_connection"
	};

	let won_pennant = {
		question: "Should your next manager have won the AL or NL pennant as a coach or manager before?",
		extra_text:"For previous managers, only their managerial record counts here.",
		answers: ["Yes", "No", "Don't Care"],
		next_if_yes: "won_ws",
		next_if_no:"nats_connection"
	};

	let won_ws = {
		question: "Should your next manager have won the World Series as a coach or manager before?",
		extra_text:"For previous managers, only their managerial record counts here.",
		answers: ["Yes", "No", "Don't Care"],
		next: "nats_connection"
	};

	let nats_connection = {
		question: "Should your next manager have coached or played for the Nationals before?",
		answers: ["Yes", "No", "Don't Care"]
	};

	question_list.set("manager", manager_question);
	question_list.set("milb_manager", milb_question);
	question_list.set("manager_experience",manager_experience);
	question_list.set("win_percentage",winning_percentage);
	question_list.set("manager_of_the_year",moty_question);
	question_list.set("coach",coach_question);
	question_list.set("coach_experience",coach_experience);
	question_list.set("highest_coach_level",highest_coach_level);
	question_list.set("age",age);
	question_list.set("former_player",former_player);
	question_list.set("made_playoffs",made_playoffs);
	question_list.set("won_pennant",won_pennant);
	question_list.set("won_ws",won_ws);
	question_list.set("top_orgs",top_orgs);
	question_list.set("player_dev",player_dev);
	question_list.set("hitting_or_pitching",hitting_or_pitching);
	question_list.set("nats_connection",nats_connection);

}

async function buildManagerChoices(){
	const response = await fetch("https://raw.githubusercontent.com/jamesohara08/NatsManager/refs/heads/main/manager_data.json?token=GHSAT0AAAAAADMAJHKC23MD5IXSJVIXVGPQ2GXQS5Q");
    data = await response.json();
    data.forEach(manager => {
    	manager_choices.push(manager);
    });
}

function changeQuestion(question_name){
	let answers = document.getElementsByName(question_name);
	var selected_answer;
	answers.forEach(answer  => {
		if(answer.checked){
			selected_answer = answer.value;
		}
	});
	var question_template;
	if(question_name == "nats_connection"){
		question_template = findManager();
	} else {
		let next_question_name = processAnswer(question_name, selected_answer, 1);
		question_template = writeQuestion(next_question_name);
	}
	let question = document.getElementById("question");
	while(question.firstChild){
        question.removeChild(question.firstChild);
    }
    question.insertAdjacentHTML('beforeend', question_template);
}

function processManagerExperience(answer, importance){
	let threshold = 0;
	switch(answer) {
		case "At least 1":
			threshold = 1;
		case "At least 3":
			threshold = 3;
		case "At least 6":
			threshold = 6;
		case "At least 11":
			threshold = 11;
		case "15 or more":
			threshold = 15;
	}
	manager_choices.forEach(manager => {
		if(manager.manager_experience >= threshold){
			manager.score += importance;
		}
	});
}

function processCoachExperience(answer, importance){
	let threshold = 0;
	switch(answer) {
		case "At least 1":
			threshold = 1;
		case "At least 4":
			threshold = 4;
		case "At least 6":
			threshold = 6;
		case "At least 8":
			threshold = 8;
		case "At least 11":
			threshold = 11;
		case "15 or more":
			threshold = 15;
	}
	manager_choices.forEach(manager => {
		if(manager.coach_experience >= threshold){
			manager.score += importance;
		}
	});

}

function processHighestCoachLevel(answer, importance){
	let acceptable_answers = [];
	switch(answer){
		case "Manager":
			acceptable_answers = ["Manager"];
		case "Bench Coach":
			acceptable_answers = ["Manager", "Bench Coach"];
		case "Associate Manager":
			acceptable_answers = ["Manager", "Bench Coach", "Associate Manager"];
		case "Hitting/Pitching Coach":
			acceptable_answers = ["Manager", "Bench Coach", "Associate Manager", "Hitting/Pitching Coach"];
		case "Base Coach":
			acceptable_answers = ["Manager", "Bench Coach", "Associate Manager", "Hitting/Pitching Coach", "Base Coach"];
		case "Position Coach":
			acceptable_answers = ["Manager", "Bench Coach", "Associate Manager", "Hitting/Pitching Coach", "Base Coach", "Position Coach"];
		case "Assistant Coach":
			acceptable_answers = ["Manager", "Bench Coach", "Associate Manager", "Hitting/Pitching Coach", "Base Coach", "Position Coach", "Assistant Coach"];
	}
	manager_choices.forEach(manager => {
		if(acceptable_answers.includes(manager.highest_coach_level)){
			manager.score += importance;
		}
	});
}

function processAge(answer, importance){
	let lower_threshold = 0;
	let upper_limit = 0;
	["35-45","46-56","57-68", "68+"]
	switch(answer) {
		case "35-45":
			lower_threshold = 35;
			upper_limit = 45;
		case "46-56":
			lower_threshold = 46;
			upper_limit = 56;
		case "57-68":
			lower_threshold = 57;
			upper_limit = 68;
		case "68+":
			lower_threshold = 68;
			upper_limit = 120;
	}
	manager_choices.forEach(manager => {
		if(manager.age >= lower_threshold && manager.age <= upper_limit){
			manager.score += importance;
		}
	});
}

function processAnswer(question_name, answer, importance){
	let question_info = question_list.get(question_name);
	switch(question_name) {
		case "manager_experience":
			processManagerExperience(answer, importance);
		case "coach_experience":
			processCoachExperience(answer, importance);
		case "highest_coach_level":
			processHighestCoachLevel(answer, importance);
		case "age":
			processAge(answer, importance);
		default:
			manager_choices.forEach(manager => {
				console.log(manager[question_name]);
				if(manager[question_name] == answer){
					manager.score += importance;
					console.log(manager.score)
				}
			});
	}
	var next_question_name;
	if("next" in question_info){
		next_question_name = question_info.next;
	}
	else {
		if(answer == "Yes"){
			next_question_name = question_info.next_if_yes;
		}
		else {
			next_question_name = question_info.next_if_no;
		}
	}
	return next_question_name;
}

function writeQuestion(next_question_name){
	let question_info = question_list.get(next_question_name);
	let question = question_info.question
	let extra_text = "";
	if("extra_text" in question_info){
		extra_text = question_info.extra_text;
	}
	let question_template = `<h2>${question}</h2>
							<h4>${extra_text}</h4>`
	let answers = question_info.answers;
	answers.forEach(answer => {
		question_template += `<p>
	      <input class="w3-radio" type="radio" name="${next_question_name}" value="${answer}">
	      <label>${answer}</label>
	    </p>`;
	});
	question_template +=`<button id="next_question" class="w3-button w3-blue w3-margin" onclick="changeQuestion('${next_question_name}')">Next Question</button>`
	return question_template;
}

function findManager(){
	let highest_score = 0;
	let winning_managers = [manager_choices[0]];
	manager_choices.forEach(manager => {
		if(manager.score > highest_score){
			winning_managers = [manager];
		}
		else if(manager.score == highest_score){
			winning_managers.push(manager)
		}
	});
	let randomIndex = Math.floor(Math.random() * winning_managers.length);
	let winning_manager = winning_managers[randomIndex];
	let manager_name = winning_manager.name;
	let manager_info = winning_manager.info;
	let name_array = manager_name.split(" ");
	let imageURL = name_array[0].toLowerCase() + "_" + name_array[1].toLowerCase() + ".jpg";
	answer_template = `<h2>Your new Nationals Manager</h2>
						<img src="images/${imageURL}" class="w3-image"/>
						<h4>${manager_name}</h4>
						<p>${manager_info}</p>`
	if(winning_managers.length > 1){
		answer_template += `<p>Here are some other equally good choices:</p>
							<ul class="w3-ul">`
		winning_managers.forEach(manager => {
			if(manager.name != manager_name){
				let runner_up = manager.name;
				answer_template += `<li>${runner_up}</li>`;
			}
		});
		answer_template += `</ul>`
	}
	let currentUrl = window.location.href;
    let encodedUrl = encodeURIComponent(currentUrl);
	answer_template += `
		<div class="w3-bar">
			<a href="https://bsky.app/intent/compose?text=My next Nationals manager is ${manager_name}! Find yours here: ${encodedUrl}" class="w3-button w3-blue" target="_blank">Share on Bluesky!</a>
			<a href="https://twitter.com/intent/tweet?text=My next Nationals manager is ${manager_name}! Find yours here: ${encodedUrl}" class="w3-button w3-black" target="_blank">Share on Twitter!</a>
		</div>
	`
	return answer_template;
}