import requests
from fastapi import FastAPI

app = FastAPI()

@app.get("/weather/{latitude}/{longitude}")
def get_weather(latitude: float, longitude: float):
    url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&hourly=temperature_2m&temperature_unit=fahrenheit"
    response = requests.get(url)
    return response.json()