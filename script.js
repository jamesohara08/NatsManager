const question_list = new Map();
var manager_choices;
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
		answers: ["Manager", "Bench Coach", "Associate Manager", "Hitting/Pitching Coach", "Base Coach", "Position Coach", "Assistant Coach","Any"],
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
		next_if_yes: "won_pennant"
	};

	let won_pennant = {
		question: "Should your next manager have won the AL or NL pennant as a coach or manager before?",
		extra_text:"For previous managers, only their managerial record counts here.",
		answers: ["Yes", "No", "Don't Care"],
		next_if_yes: "won_ws",
		next_if_no:"manager_bonus"
	};

	let won_ws = {
		question: "Should your next manager have won the World Series as a coach or manager before?",
		extra_text:"For previous managers, only their managerial record counts here.",
		answers: ["Yes", "No", "Don't Care"],
		next: "manager_bonus"
	};

	let manager_bonus = {
		question: "Should managers get a bonus multiplier for the playoff questions compared to coaches?",
		answers: ["Yes, 1.5", "Yes, 2", "Yes, 3", "Yes, 5", "No"],
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
	question_list.set("manager_bonus",manager_bonus);
	question_list.set("top_orgs",top_orgs);
	question_list.set("player_dev",player_dev);
	question_list.set("hitting_or_pitching",hitting_or_pitching);
	question_list.set("nats_connection",nats_connection);

}

async function buildManagerChoices(){
	const response = await fetch("https://raw.githubusercontent.com/jamesohara08/NatsManager/refs/heads/master/manager_data.json");
    manager_choices = await response.json();
    return data;
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
		let next_question_name = processAnswer(question_name, selected_answer);
		question_template = writeQuestion(next_question_name);
	}
	let question = document.getElementById("question");
	while(question.firstChild){
        question.removeChild(question.firstChild);
    }
    question.insertAdjacentHTML('beforeend', question_template);
}

function processAnswer(question_name, answer){
	let question_info = question_list.get(question_name);
	if(question_name == "manager_experience" || question_name == "coach_experience" || question_name == 'highest_coach_level' || question_name == "age" || question_name == "hitting_or_pitching" || question_name == "manager_bonus")
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