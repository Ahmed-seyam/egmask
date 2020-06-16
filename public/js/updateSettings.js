/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

// type is either 'password' or 'data'
export const updateSettings = async (data, type, person) => {
  try {
    const url =
      type === "password"
        ? `/api/v1/${person}/updateMyPassword`
        : `/api/v1/${person}/updateMe`;

    const res = await axios({
      method: "PATCH",
      url,
      data
    });

    if (res.data.status === "success") {
      showAlert("success", `تم التحديث بنجاح`);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
