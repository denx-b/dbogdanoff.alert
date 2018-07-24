;(function (window) {
  if (typeof window.BX.dbogdanoff_alert === "undefined") {
    var wrapper = document.createElement("div"),
      wrapperInserted = false;

    wrapper.classList.add("dbogdanoff-alert");

    window.BX.dbogdanoff_alert = function (message, type) {
      if (wrapperInserted === false) {
        wrapperInserted = true;
        document.body.appendChild(wrapper);
      }

      var div = document.createElement("div");
      div.className = "dbogdanoff-alert__item";

      if (type)
        div.classList.add("dbogdanoff-alert__item--" + type);

      if (message)
        div.innerHTML = message;

      wrapper.appendChild(div);
      div.classList.add("dbogdanoff-alert__item--show");

      setTimeout(function () {
        div.classList.remove("dbogdanoff-alert__item--show");
      }, 3000);
    }
  }
})(window);
