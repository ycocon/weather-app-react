import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMapMarkerAlt } from "react-icons/fa";
import Clear from "./assets/img/clear.png";
import Cloud from "./assets/img/cloud.png";
import Mist from "./assets/img/mist.png";
import Rain from "./assets/img/rain.png";
import Snow from "./assets/img/snow.png";
import Haze from "./assets/img/haze.png";
import error from "./assets/img/404.png";
import icon1 from "./assets/img/humidity-icon.png";
import icon2 from "./assets/img/wind-speed-icon.png";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleClick = () => {
    setLocation(input);
  };

  const APIKEY = "8e7a365fe3560360d4e7b4fc4cdbba48";

  useEffect(() => {
    setIsLoading(true);
    if (location == "") {
      setWeatherData("empty input");
      setIsLoading(false);
    } else {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIKEY}`
          );
          if (response.status == 400) {
            throw new Error("Empty input");
          } else if (response.status == 404) {
            setWeatherData(null);
            throw new Error("Weather data not available");
          }

          const data = await response.json();
          setWeatherData(data);
        } catch (error) {
          console.log(error);
        }
        setIsLoading(false);
      };

      fetchData();
    }
  }, [location]);

  if (isLoading) {
    return (
      <div className="loading">
        <h3>Loading...</h3>
      </div>
    );
  } else if (!weatherData) {
    return (
      <div className="container">
        <Location
          input={input}
          handleInputChange={handleInputChange}
          handleClick={handleClick}
        />
        <img src={error} alt="404 icon" className="image" id="image" />
        <p id="error-text">Weather Data Not Available</p>
      </div>
    );
  } else if (weatherData == "empty input") {
    return (
      <div className="container">
        <Location
          input={input}
          handleInputChange={handleInputChange}
          handleClick={handleClick}
        />
      </div>
    );
  }

  // console.log(weatherData);
  let imgSrc;
  switch (weatherData.weather[0].main) {
    case "Clear":
      imgSrc = Clear;
      break;
    case "Clouds":
      imgSrc = Cloud;
      break;
    case "Mist":
      imgSrc = Mist;
      break;
    case "Rain":
      imgSrc = Rain;
      break;
    case "Snow":
      imgSrc = Snow;
      break;
    case "Haze":
      imgSrc = Haze;
      break;
    default:
      imgSrc = "";
  }

  return (
    <div className="container">
      <Location
        input={input}
        handleInputChange={handleInputChange}
        handleClick={handleClick}
      />
      <img src={imgSrc} alt={weatherData.weather[0].main} className="image" />
      <p id="temperature">
        {(weatherData.main.temp - 273.15).toFixed(0)}
        <span>°C</span>
      </p>
      <p id="description">{weatherData.weather[0].description}</p>
      <div className="humid-speed">
        <div className="humid_wind">
          <img src={icon1} alt="humidity icon" className="bottom-icon" />
          <div className="humidity">
            <p id="humidity">{weatherData.main.humidity}%</p>
            <p>Humidity</p>
          </div>
        </div>
        <div className="humid_wind">
          <img src={icon2} alt="wind speed icon" className="bottom-icon" />
          <div className="wind">
            <p id="wind">{(weatherData.wind.speed * 3.6).toFixed(0)}Km/h</p>
            <p>Wind Speed</p>
          </div>
        </div>
      </div>

      <p className="name-country">
        {weatherData.name}, {weatherData.sys.country}
      </p>
    </div>
  );
}

const Location = ({ input, handleInputChange, handleClick }) => {
  return (
    <div className="location-input">
      <FaMapMarkerAlt className="icon" />
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="city"
      />
      <button type="button" onClick={handleClick}>
        <AiOutlineSearch />
      </button>
    </div>
  );
};

export default App;
