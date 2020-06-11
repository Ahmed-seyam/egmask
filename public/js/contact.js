/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

export const recieveEmail = async data => {
  try {
    console.log("Data From contact", data);

    const res = await axios({
      method: "POST",
      url: "/api/v1/emails",
      data
    });

    console.log("Data From contact", data);

    if (res.data.status === "success") {
      showAlert("success", "تم ارسال الرساله بنجاح");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert("error", err.response.data.message);
  }
};
