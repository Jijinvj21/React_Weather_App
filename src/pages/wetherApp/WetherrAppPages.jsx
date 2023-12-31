import React, { useState } from "react";
import Search from "../../components/ui/Search";
import CurrentWether from "../../components/ui/CurrentWether";
import { WETHER_API_URL, WETHER_API_KEY } from "../../components/api/api";
import ForeCast from "../../components/ui/ForeCast";
import LocationSelect from "../../components/ui/LocationSelect";
import { BallTriangle } from "react-loader-spinner";

function WetherrAppPages() {
  const [currentWether, setCurrentWether] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [location, setLocation] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const handilOnSearchChange = (searchData) => {
    const [lat, lon] = searchData?.value?.split(" ");
    const currentWetherFetch = fetch(
      `${WETHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WETHER_API_KEY}&units=metric `
    );

    const forecastFetch = fetch(
      `${WETHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WETHER_API_KEY}&units=metric `
    );

    setSpinner(true);

    Promise.all([currentWetherFetch, forecastFetch])
      .then(async (responce) => {
        const wetherResponce = await responce[0].json();
        const forcastResponce = await responce[1].json();
        setCurrentWether({ city: searchData.label, ...wetherResponce });
        setForecast({ city: searchData.label, ...forcastResponce });
        setSpinner(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClick = () => {
    setLocation(true);
  };
  return (
    <>
      
        <div className="flex flex-col items-center w-full min-h-screen backdrop-blur-sm ">
          <div className="flex">
            <Search onSearchChange={{ handilOnSearchChange }} />
            <button onClick={handleClick} className="mt-5 mx-3 ">
              <img
                src={`assets/images/location.png`}
                alt="location"
                className="w-10 h-10 "
              />
            </button>
          </div>

          <LocationSelect
            selectLocation={{ handilOnSearchChange }}
            toggler={location}
            setToggler={setLocation}
            search={currentWether}
          />
{spinner ? (
        <div className="w-full h-screen flex justify-center items-center backdrop-blur-2xl">
          <BallTriangle
            height={150}
            width={150}
            radius={5}
            color="#fff"
            ariaLabel="ball-triangle-loading"
            wrapperClass={{}}
            wrapperStyle=""
            visible={true}
          />
        </div>
      ) : (
          <div className=" w-full">
            <div className="w-full">
              {currentWether && <CurrentWether data={currentWether} />}
              {forecast && <ForeCast data={forecast} />}
            </div>
          </div>
          )}
        </div>
      
    </>
  );
}

export default WetherrAppPages;
