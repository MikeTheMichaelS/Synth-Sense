import requests
import json
import time
from fastapi import FastAPI
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware


middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=['*'],
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*']
    )
]

weather_data = json.loads('{}')
daylight_data = json.loads('{}')
weather_time = 0
daylight_time = 0


app = FastAPI(middleware=middleware)

origins = [
    ["http://localhost:3000"]
]

@app.get("/weather/{latitude}/{longitude}")

def get_weather(latitude: float, longitude: float):
    if time.time - weather_time >= 1800:
        # Outdated data, get new one
        print("Outdated data, get new one")
        url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={-longitude}&hourly=temperature_2m&temperature_unit=fahrenheit&forecast_days=1&timezone=EST"
        weather_data = requests.get(url).json()
        weather_time = time.time()
        print("New weather data got")
        return weather_data
    else:
        # Old data still valid, using cache
        print("Using old weather data")
        return weather_data


# gets daylight data from sunrise-sunset api
@app.get("/daylight/{latitude}/{longitude}")
def get_daylight(latitude: float, longitude: float):
    if time.time() - daylight_time >= 1800:
        # Outdated data, get new one.
        print("Outdated data, get new one.")
        url = f"https://api.sunrise-sunset.org/json?date=today&lat={latitude}&lng={longitude}"
        daylight_data = requests.get(url).json()
        daylight_time = time.time()
        print("New daylight data got")
        return daylight_data
    else:
        # Old data stil valid, using cache
        print("Using old daylight data")
        return daylight_data