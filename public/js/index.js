/* eslint-disable */
import "@babel/polyfill";
import "vanilla-tilt";

import { displayMap } from "./mapbox";
import { login, logout } from "./login";
import { signup } from "./signup";
import { signupAsPromoter } from "./signupAsPromoter";
import { createProduct, deleteProuct } from "./product";
import { createPromoter, deletePromoter } from "./promoter";
import { updateSettings } from "./updateSettings";
import { updateLoc, removeLoc, addLoc } from "./addLocation";
import { updateSelection } from "./updateProductsSelection";
import { recieveEmail } from "./contact";
import { sendEmail } from "./forgetPass";
import { resetPassword } from "./resetPassword";
import { showAlert } from "./alerts";
import { addAnotherLocation } from "./signup_promoter_div";
import "./all.min";
import { objectToFormData } from "object-to-formdata";
import axios from "axios";

// DOM ELEMENTS
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form__login");
const signupForm = document.querySelector(".form--signup");
const signupPromoterForm = document.querySelector(".form--signup_promoters");
const productForm = document.querySelector(".form--product");
const deleteProductForm = document.querySelector(".delete__product--form");
const deletePromoterForm = document.querySelector(".delete__promoter--form");
const promoterForm = document.querySelector(".form--promoter");
const logOutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const promoterDataForm = document.querySelector(".form-promoter-data");
const userPasswordForm = document.querySelector(".form-user-password");
const promoterPasswordForm = document.querySelector(".form-promoter-password");
const contactForm = document.querySelector(".contact--form");
const forgetForm = document.querySelector(".forget--form");
const resetForm = document.querySelector(".reset--form");
const signupPromoterPage = document.querySelector(".auth_promoter--div");
const addLocation = document.querySelector(".add_location-location");
const updateProducts = document.querySelector(".products_form");
const updateLocation = Array.from(
  document.querySelectorAll(".update_location--form")
);

if (loginForm)
  loginForm.addEventListener("submit", e => {
    console.log("sent");
    e.preventDefault();
    const email = document.getElementById("email__login").value;
    const password = document.getElementById("password__password").value;
    login(email, password);
  });

if (signupForm)
  signupForm.addEventListener("submit", e => {
    e.preventDefault();
    const form = new FormData(); // Multipart Form Data
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("phoneNumber", document.getElementById("phone").value);
    form.append("password", document.getElementById("password").value);
    form.append(
      "passwordConfirm",
      document.getElementById("passwordConfirm").value
    );
    form.append("photo", document.getElementById("photo").files[0]);
    signup(form);
  });

if (signupPromoterForm)
  signupPromoterForm.addEventListener("submit", e => {
    e.preventDefault();
    const form = new FormData(); // Multipart Form Data
    const elements = Array.from(document.querySelector(".locate").children).map(
      el => {
        if (el.classList.contains("loc") === true) {
          return el;
        }
      }
    );
    let locations = elements.map((item, i) => {
      if (item !== undefined) {
        i++;
        return {
          coordinates: [
            document.getElementById(`lat${i}`).value,
            document.getElementById(`lng${i}`).value
          ],
          address: document.getElementById(`adress_location${i}`).value
        };
      }
    });
    locations = locations.filter(function(v) {
      return v !== undefined;
    });
    const elementsProducts = Array.from(
      document.querySelector(".checkboxes").children
    );

    const products = elementsProducts.map((el, i) => {
      i++;
      let pro = document.querySelector(`.input${i}`);
      if (pro.checked) {
        return pro.id;
      }
    });

    const object = {
      name: document.getElementById("name_promoter").value,
      email: document.getElementById("email_promoter").value,
      phoneNumber: document.getElementById("phone_promoter").value,
      password: document.getElementById("password_promoter").value,
      passwordConfirm: document.getElementById("passwordConfirm_promoter")
        .value,
      products,
      photo: document.getElementById("photo_promoter").files[0]
    };
    const locationsObject = locations.entries();
    for (var [index, element] of locationsObject) {
      console.log(element);
      object[`locations[${index}]`] = element;
    }
    console.log(object);

    const formdata = objectToFormData(object, { indeces: true });

    signupAsPromoter(formdata);
  });

if (productForm)
  productForm.addEventListener("submit", e => {
    e.preventDefault();
    const form = new FormData(); // Multipart Form Data
    form.append("name", document.getElementById("product_name").value);
    form.append("price", document.getElementById("price").value);
    form.append("description", document.getElementById("description").value);
    console.log(document.getElementById("photo__product").files);
    form.append("photo", document.getElementById("photo__product").files[0]);
    createProduct(form);
  });

if (deleteProductForm)
  deleteProductForm.addEventListener("submit", e => {
    e.preventDefault();
    const id = document.getElementById("id").value;
    deleteProuct(id);
  });

if (promoterForm)
  promoterForm.addEventListener("submit", e => {
    e.preventDefault();
    const form = new FormData(); // Multipart Form Data
    const locations = {
      coordinates: [
        document.getElementById("lat").value,
        document.getElementById("lng").value
      ],

      address: document.getElementById("adress").value
    };
    const object = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phoneNumber: document.getElementById("phone").value,
      product: document.getElementById("product").value,
      photo: document.getElementById("photo_promoter").files[0]
    };

    const formdata = objectToFormData(object);
    formdata.append("locations", JSON.stringify(locations));
    createPromoter(formdata);
  });

if (deletePromoterForm)
  deletePromoterForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.querySelector(".email__promoter").value;
    deletePromoter(email);
  });

if (updateLocation)
  updateLocation.forEach((item, i) => {
    item.addEventListener("submit", e => {
      console.log(e.path[0]);

      e.preventDefault();
      let data;
      if (e.submitter.dataset.action === "update") {
        data = {
          locationId: e.submitter.dataset.id,
          newLocation: {
            coordinates: [
              document.getElementById(`lat${e.submitter.dataset.num}`).value,
              document.getElementById(`lng${e.submitter.dataset.num}`).value
            ],
            address: document.getElementById(
              `address${e.submitter.dataset.num}`
            ).value
          }
        };
        updateLoc(data);
      } else {
        data = {
          promoterId: document.querySelector(".profile__update_locations--div")
            .dataset.promoter,
          locationId: e.submitter.dataset.id
        };

        removeLoc(data, e.path[0]);
      }
    });
  });

if (addLocation) {
  addLocation.addEventListener("submit", e => {
    e.preventDefault();
    const data = {
      promoterId: document.querySelector(".profile--sec").dataset.promoter,
      newLocation: {
        coordinates: [
          document.getElementById(`lat`).value,
          document.getElementById(`lng`).value
        ],
        address: document.getElementById(`address`).value
      }
    };
    addLoc(data);
  });
}

if (updateProducts) {
  updateProducts.addEventListener("submit", e => {
    e.preventDefault();
    let products;
    products = Array.from(document.querySelectorAll(".input_check")).map(el => {
      if (el.checked) {
        return el.getAttribute("id");
      }
    });
    products = products.filter(function(v) {
      return v !== undefined;
    });
    console.log(products);
    const data = {
      promoterId: document.querySelector(".profile--sec").dataset.promoter,
      products
    };
    updateSelection(data);
  });
}

if (logOutBtn) logOutBtn.addEventListener("click", logout);

if (userDataForm)
  userDataForm.addEventListener("submit", e => {
    e.preventDefault();
    const form = new FormData(); // Multipart Form Data
    form.append("name", document.getElementById("update_name").value);
    form.append("email", document.getElementById("update_email").value);
    form.append("phoneNumber", document.getElementById("update_phone").value);
    form.append("photo", document.getElementById("update_photo").files[0]);
    updateSettings(form, "data", "users");
  });

if (promoterDataForm)
  promoterDataForm.addEventListener("submit", e => {
    e.preventDefault();
    const form = new FormData(); // Multipart Form Data
    form.append("name", document.getElementById("update_name").value);
    form.append("email", document.getElementById("update_email").value);
    form.append("phoneNumber", document.getElementById("update_phone").value);
    form.append("photo", document.getElementById("update_photo").files[0]);
    updateSettings(form, "data", "promoters");
  });

if (userPasswordForm)
  userPasswordForm.addEventListener("submit", async e => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent =
      "جاري التحديث ...";
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password",
      "users"
    );

    document.querySelector(".btn--save-password").textContent =
      "تحديث كلمه السر";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });

if (promoterPasswordForm)
  promoterPasswordForm.addEventListener("submit", async e => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent =
      "جاري التحديث ...";
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password",
      "promoters"
    );

    document.querySelector(".btn--save-password").textContent =
      "تحديث كلمه السر";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });

const alertMessage = document.querySelector("body").dataset.alert;
if (alertMessage) {
  showAlert("success", alertMessage, 20);
}

const btnsArrray = Array.from(
  document.querySelectorAll('button[data-type="explore"]')
);

if (btnsArrray) {
  btnsArrray.map(el => {
    el.addEventListener("click", () => {
      getProductPromoters(el);
    });
  });
}

const removeMap = () => {
  document.getElementById("map").innerHTML = "";
};

const getProductPromoters = async el => {
  try {
    const url = `/api/v1/products/${el.dataset.id}`;
    const res = await axios({
      method: "Get",
      url
    });
    if (
      res.data.status === "success" &&
      res.data.data.data.promoters.length !== 0
    ) {
      window.setTimeout(() => {
        location.assign("#map--sec");
      }, 1000);
      removeMap();
      displayMap(res.data.data.data.promoters);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

if (contactForm) {
  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    const data = {
      name: document.querySelector("#contact_name").value,
      email: document.querySelector("#contact_email").value,
      message: document.querySelector("#contact_message").value
    };
    if (data.name === "" || data.email === "" || data.message === "") {
      return showAlert("error", "ضع جميع البيانات ");
    }
    console.log(`Data from index.js`, data);
    recieveEmail(data);
  });
}

if (forgetForm) {
  forgetForm.addEventListener("submit", e => {
    e.preventDefault();
    const data = {
      email: document.querySelector("#email__forget").value
    };
    if (data.email === "") {
      return showAlert("error", "ضع جميع البيانات");
    }
    console.log(`Data from index.js`, data);
    sendEmail(data);
  });
}

if (resetForm) {
  resetForm.addEventListener("submit", e => {
    e.preventDefault();
    const token = document.querySelector("#new_token").value;
    const data = {
      password: document.querySelector("#new_password").value,
      passwordConfirm: document.querySelector("#confirm_password").value
    };
    if (data.password === "" || data.passwordConfirm === "") {
      return showAlert("error", "ضع جميع البيانات");
    }
    console.log(`Data from index.js`, data);
    resetPassword(data, token);
  });
}

if (signupPromoterPage) {
  addAnotherLocation();
}

if (window.location.pathname.match(/profile/g) !== null) {
  if (window.location.search.match(/pass/g) !== null) {
    document.querySelector(".profile__passowrd--div").style.display = "block";
    document.querySelector(".pass").classList.add("active");
  } else if (window.location.search.match(/add_product/g) !== null) {
    document.querySelector(".profile__products--div").style.display = "block";
    document.querySelector(".add_product").classList.add("active");
  } else if (window.location.search.match(/remove_product/g) !== null) {
    document.querySelector(".delete__product--div").style.display = "block";
    document.querySelector(".remove_product").classList.add("active");
  } else if (window.location.search.match(/add_promoter/g) !== null) {
    document.querySelector(".profile__promoters--div").style.display = "block";
    document.querySelector(".add_promoter").classList.add("active");
  } else if (window.location.search.match(/remove_promoter/g) !== null) {
    document.querySelector(".delete__promoter--div").style.display = "block";
    document.querySelector(".remove_promoter").classList.add("active");
  } else if (window.location.search.match(/data/g) !== null) {
    document.querySelector(".profile__settings--div").style.display = "block";
    document.querySelector(".data").classList.add("active");
  } else if (window.location.search.match(/update_loc/g) !== null) {
    document.querySelector(".profile__location--div").style.display = "block";
    document.querySelector(".update_loc").classList.add("active");
  } else if (window.location.search.match(/updateLocations/g) !== null) {
    document.querySelector(".profile__update_locations--div").style.display =
      "block";
    document.querySelector(".update_locations").classList.add("active");
  } else if (window.location.search.match(/updateProducts/g) !== null) {
    document.querySelector(".profile__update_products--div").style.display =
      "block";
    document.querySelector(".updateProducts").classList.add("active");
  }
}
