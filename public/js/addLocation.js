/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

// type is either 'password' or 'data'
export const addLoc = async data => {
  try {
    const url = "/api/v1/promoters/add-location";

    const res = await axios({
      method: "PATCH",
      url,
      data
    });
    if (res.data.status === "success") {
      showAlert("success", `تمت الاضافه بنجاح`);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const updateLoc = async data => {
  try {
    const url = "/api/v1/promoters/update-location";

    const res = await axios({
      method: "PATCH",
      url,
      data
    });
    if (res.data.status === "success") {
      showAlert("success", `تم التعديل بنجاح`);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const removeLoc = async (data, form) => {
  try {
    const url = "/api/v1/promoters/remove-location";

    const res = await axios({
      method: "DELETE",
      url,
      data
    });
    if (res.data.status === "success") {
      showAlert("success", `تم الحذف بنجاح`);
      form.parentElement.removeChild(form);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
