import WeatherTemp from './components/WeatherTemp';
import BlobArt from './components/BlobArt';
import AudioLevel from './components/AudioLevel';


function App() {
  return(  
    <div className='App'>
      <WeatherTemp />
      {/* <AudioLevel /> */}
      <BlobArt />
      {/* <CurrentLocation /> */}
    </div>
  );

  
}

export default App;
