/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

// type is either 'password' or 'data'
export const createProduct = async data => {
  try {
    const url = "/api/v1/products";

    const res = await axios({
      method: "POST",
      url,
      data
    });
    console.log(res);
    if (res.data.status === "success") {
      showAlert("success", `تم انشاء المنتج بنجاح`);
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const deleteProuct = async data => {
  try {
    const url = `/api/v1/products/${data}`;

    const res = await axios({
      method: "DELETE",
      url
    });
    console.log(res);
    if (res.status === 204) {
      showAlert("success", `تم حذف المنتج`);
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
