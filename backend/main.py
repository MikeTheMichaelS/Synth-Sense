import requests
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

app = FastAPI(middleware=middleware)

origins = [
    ["http://localhost:3000"]
]

@app.get("/weather/{latitude}/{longitude}")

def get_weather(latitude: float, longitude: float):
    url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={-longitude}&hourly=temperature_2m&temperature_unit=fahrenheit&forecast_days=1&timezone=EST"
    response = requests.get(url)
    return response.json()


# gets daylight data from sunrise-sunset api
@app.get("/daylight/{latitude}/{longitude}")
def get_daylight(latitude: float, longitude: float):
    url = f"https://api.sunrise-sunset.org/json?date=today&lat={latitude}&lng={longitude}"
    response = requests.get(url)
    return response.json()