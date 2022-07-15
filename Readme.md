# Fibonacci API

To run this you must have docker installed!  
Enter next commands in app folder:  
docker-compose build  
docker-compose up

#

POST /input with body {"number": "XXX"}, where XXX is fibonacci index, must be in between -50000 and 50000 and you will get your ticket number

GET /output?ticket=YYY where YYY is your ticket number to get result of your calculation

#

Raw app can hanle up to 20k req/s, dockerized about 5k req/s
