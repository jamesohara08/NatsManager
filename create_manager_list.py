import json
managers = []
with open("coachdata.csv") as in_f:
	header = in_f.readline().strip('\n').split(',')
	for line in in_f:
		row = line.strip('\n').split(',')
		new_manager = {
			"name":row[0],
			"info":row[1],
			"nats_connection": row[2],
			"manager": row[3],
			"milb_manager": row[4],
			"manager_experience":int(row[5]),
			"coach": row[6],
			"coach_experience":int(row[7]),
			"highest_coach_level":row[8],
			"former_player":row[9],
			"hitting_or_pitching":row[10],
			"player_dev":row[11],
			"made_playoffs":row[12],
			"won_pennant":row[13],
			"won_ws":row[14],
			"age":int(row[15]),
			"winning_percentage":float(row[16]),
			"manager_of_the_year":row[17],
			"top_orgs":row[18]
		}
		managers.append(new_manager)

with open("manager_data.json","w") as out_f:
	json.dump(managers, out_f, indent=4)