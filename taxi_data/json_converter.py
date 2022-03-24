import pandas as pd
import json 

excel_data = pd.read_excel('Taxi1.xlsx')

l = excel_data.values.tolist()
Taxi = []

for i in l:
    data = i[0]
    splitted_data = data.split(",")
    taxi_data = {
        "time" : splitted_data[0],
        "latitude": splitted_data[1],
        "longitude": splitted_data[2],
        "taxi_id": splitted_data[3]
    }
    Taxi.append(taxi_data)

with open("Taxi1.json", "w") as outfile:
    json.dump(Taxi, outfile)