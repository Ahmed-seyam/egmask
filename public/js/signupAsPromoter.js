/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

// type is either 'password' or 'data'
export const signupAsPromoter = async data => {
  try {
    const url = "/api/v1/promoters/signup";

    const res = await axios({
      method: "POST",
      url,
      data
    });
    if (res.data.status === "success") {
      showAlert("success", `signed up successfully!`);
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
