/* eslint-disable*/
import { showAlert } from "./alerts";

export const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    showAlert("error", "Geolocation is not supported by this browser.");
  }
};

function showPosition(position) {
  document.getElementById("lat1").value = position.coords.longitude;
  document.getElementById("lng1").value = position.coords.latitude;
  console.log(position.coords);
}
