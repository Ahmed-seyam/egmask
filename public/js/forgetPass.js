/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

export const sendEmail = async data => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/forgotPassword",
      data
    });

    if (res.data.status === "success") {
      showAlert("success", "تم ارسال رساله الي بريدك الالكتروني ");
      window.setTimeout(() => {
        location.assign("/reset");
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert("error", err);
  }
};
