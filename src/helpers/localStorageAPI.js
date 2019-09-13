export let setToLocalStorage = function(itemsArr) {
  localStorage.setItem("itemsArr", JSON.stringify(itemsArr));
  return itemsArr;
};

export let getFromLocalStorage = function() {
  const stringData = localStorage.getItem("itemsArr");
  let data = [];

  try {
    data = JSON.parse(stringData);
  } catch (err) {
    console.log("Error parsing localStorage data...");
  }

  return data ? data : [];
};
