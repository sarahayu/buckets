"""
Turn scenario CSV files to json format. All CSV files should be in `./scenarios/`.
Output will be in `./output/`.

Usage: python3 process.py
""" 

import os
import csv
import json
import math

IN_FOLDER = 'scenarios'
OUT_FOLDER = 'output'

all_files = sorted([f for f in os.listdir(IN_FOLDER) if os.path.isfile(os.path.join(IN_FOLDER, f))])

PREC = 1e2

def num_shorten(n):
    return int(n)
    # return round(n * PREC) / PREC

if not os.path.exists(OUT_FOLDER):
    os.makedirs(OUT_FOLDER)

all_objectives = []

for objective_file in all_files:
    with open(os.path.join(IN_FOLDER, objective_file), 'r') as objective_csv:

        print(objective_file)

        csvreader = csv.reader(objective_csv)
        scenario_map = {}

        scen_names = next(csvreader)
        scen_names = scen_names[1:]

        for scen_name in scen_names:
            scenario_map[scen_name] = []

        SKIP_TRASH = 6

        for _ in range(SKIP_TRASH):
            next(csvreader)

        for row_nums in csvreader:
            for idx, num in enumerate(row_nums):
                if idx == 0:
                    continue
                scenario_map[scen_names[idx - 1]].append(float(num))

        for scen_name in scen_names:
            monthly_data = scenario_map[scen_name]
            tot_months = len(monthly_data)
            new_data = []
            for i in range(math.ceil(tot_months / 12)):
                year_data = monthly_data[i * 12:min((i + 1) * 12, tot_months)]
                year_avg = sum(year_data) / len(year_data)
                new_data.append(num_shorten(year_avg))

            scenario_map[scen_name] = new_data

        # convert map to array

        scenario_array = []

        for scen_name in scenario_map:
            scenario_array.append({
                'name': scen_name,
                'delivs': scenario_map[scen_name]
            })

        # with open(os.path.join(OUT_FOLDER, objective_file + '.json'), 'w') as out_json:
        #     json.dump(scenario_map, out_json)

        objective_name = objective_file.split('.')[0]

        all_objectives.append({
            'obj': objective_name,
            'scens': scenario_array
        })

with open(os.path.join(OUT_FOLDER, 'all_objectives.json'), 'w') as out_json:
    json.dump(all_objectives, out_json)