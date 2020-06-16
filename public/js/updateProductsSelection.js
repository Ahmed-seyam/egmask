/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

// type is either 'password' or 'data'
export const updateSelection = async data => {
  try {
    const url = "/api/v1/promoters/update-product";

    const res = await axios({
      method: "PATCH",
      url,
      data
    });
    if (res.data.status === "success") {
      showAlert("success", `تم التحديث بنجاح`);
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
