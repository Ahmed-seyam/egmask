/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

// type is either 'password' or 'data'
export const createPromoter = async data => {
  try {
    const url = "/api/v1/promoters";

    const res = await axios({
      method: "POST",
      url,
      data
    });
    console.log(res);
    if (res.data.status === "success") {
      showAlert("success", `promoter Created successfully!`);
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const deletePromoter = async email => {
  try {
    const url = "/api/v1/promoters";

    const res = await axios({
      method: "DELETE",
      url,
      data: {
        email
      }
    });
    if (res.status === 204) {
      showAlert("success", `promoter Deleted successfully!`);
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
