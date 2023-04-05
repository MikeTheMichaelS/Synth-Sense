# Synth Sense

![Alt Text](https://drive.google.com/file/d/13ljYOJXup74jepw07djMz0QvUuUu6VLP/view?usp=sharing)
Synth Sense is a dynamic wall art project that uses real-time data on weather, noise, and motion to create an interactive and visually striking display. The art reacts to the movements and interactions of people in the space, changing in color and pattern based on their presence and activity. Additionally, Synth Sense incorporates informational text such as the company's logo and real-time weather and time updates to provide useful information to viewers. The art is designed to be displayed in meeting rooms or lobbies of companies, creating an engaging and memorable visual experience for visitors and employees alike.

## Dependencies 

[![Python Version](https://img.shields.io/badge/Python-3.11.3-brightgreen)](https://www.python.org/downloads/)
[![Uvicorn Version](https://img.shields.io/badge/Uvicorn-0.21.0-brightgreen)](uvicorn.org)
[![Node Version](https://img.shields.io/badge/Node-18.14.0-brightgreen)](https://nodejs.org/en)
[![React Version](https://img.shields.io/badge/React-18.2.0-brightgreen)](https://react.dev/)
[![Axios Version](https://img.shields.io/badge/Axios-1.3.5-brightgreen)](https://www.npmjs.com/package/react-axios)
[![FastAPI Version](https://img.shields.io/badge/Fast-0.95.0-brightgreen)](https://fastapi.tiangolo.com/)
[![p5 Version](https://img.shields.io/badge/p5-1.6.0-brightgreen)](https://p5js.org/)
[![ml5 Version](https://img.shields.io/badge/ml5-0.12.2-brightgreen)](https://ml5js.org/)



<!-- - Python: v3.11.3
- Uvicorn: v0.21.0
- Node: v18.14.0
- React: v18.2.0
- Axios: v1.3.5
- Fastapi: v0.95.0
- p5: v1.6.0
- ml5: v0.12.2  -->

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Set up [Local]
* Clone the repo
``` 
git clone [HTTPS/SSH link]
```
* Install dependencies/packages
    * Make sure to have python and Node installed
```
pip install uvicorn
pip install fastapi
cd frontend && npm install
```
* Start the backend process
   * open new terminal
   ```
   cd backend && uvicorn main:app --reload
   ```
* Start the frontend process
   * In the frontend directory:
   ```
   npm start
   ```
   * open your local host (localhost:3000)

## Website Access
* Open browser and enter "https://synth-sense1.web.app/"
