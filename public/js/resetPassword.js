/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

export const resetPassword = async (data, token) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/users/resetPassword/${token}`,
      data
    });

    if (res.data.status === "success") {
      showAlert("success", "تم تحديث كلمه السر");
      window.setTimeout(() => {
        location.assign("/auth?q=login");
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert("error", err);
  }
};
