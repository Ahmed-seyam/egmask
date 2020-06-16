/* eslint-disable */
export const addAnotherLocation = () => {
  const locations = document.querySelector(".locations");
  const addBtn = document.getElementById("add_location");
  let num = 1;
  let markup;

  const appendMarkup = () => {
    num = num + 1;
    markup = `
    <div class='location${num} loc'>
      <div class='points'>
        <input id='lat${num}' type='text' name='lat' value='' placeholder='خط العرض'>
        <input id='lng${num}' type='text' name='lng' value='' placeholder='خط الطول'>
      </div>
      <div class='adress'>
        <input id='adress_location${num}' type='text' name='adress' value='' placeholder='العنوان'>
      </div>
    </div>
    `;
    locations.insertAdjacentHTML("afterBegin", markup);
  };

  addBtn.addEventListener("click", appendMarkup);
};
