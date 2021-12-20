const toCurrency = price => {
  return new Intl.NumberFormat("ru-RU", {
    currency: "byr",
    style: "currency"
  }).format(price);
};

const toDate = date => {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date(date));
};

document.querySelectorAll(".price").forEach(node => {
  node.textContent = toCurrency(node.textContent);
});

document.querySelectorAll(".date").forEach(node => {
  node.textContent = toDate(node.textContent);
});

const $card = document.querySelector("#card");
if ($card) {
  $card.addEventListener("click", event => {
    if (event.target.classList.contains("js-remove")) {
      const id = event.target.dataset.id;
      const csrf = event.target.dataset.csrf;

      fetch("/card/remove/" + id, {
        method: "delete",
        headers: {
          "X-XSRF-TOKEN": csrf
        }
      })
        .then(res => res.json())
        .then(card => {
          if (card.events.length) {
            const html = card.events
              .map(c => {
                return `
              <tr>
                <td>${c.title}</td>
                <td>${c.count}</td>
                <td>
                  <button class="btn btm-small js-remove" data-id="${c.id}">Удалить</button>
                </td>
              </tr>
              `;
              })
              .join("");
            $card.querySelector("tbody").innerHTML = html;
            $card.querySelector(".price").textContent = toCurrency(card.price);
          } else {
            $card.innerHTML = "<p>Корзина пуста</p>";
          }
        });
    }
  });
}

M.Tabs.init(document.querySelectorAll(".tabs"));

//mobile menu
document.addEventListener("DOMContentLoaded", function() {
  M.Sidenav.init(document.querySelectorAll(".sidenav"));
});

//calendar
document.addEventListener("DOMContentLoaded", function() {
  const elems = document.querySelectorAll(".datepicker");
  M.Datepicker.init(elems, {
    firstDay: true,
    format: "yyyy-mm-dd",
    i18n: {
      months: [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь"
      ],
      monthsShort: [
        "Янв",
        "Фев",
        "Мар",
        "Апр",
        "Май",
        "Июн",
        "Июл",
        "Авг",
        "Сен",
        "Окт",
        "Ноя",
        "Дек"
      ],
      weekdays: [
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота",
        "Воскресенье"
      ],
      weekdaysShort: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
      weekdaysAbbrev: ["П", "В", "С", "Ч", "П", "С", "В"]
    }
  });
});

//time
document.addEventListener("DOMContentLoaded", function() {
  const elems = document.querySelectorAll(".timepicker");
  M.Timepicker.init(elems, {
    twelveHour: false,
    vibrate: true
  });
});

//modal
document.addEventListener("DOMContentLoaded", function() {
  const elems = document.querySelectorAll(".modal");
  M.Modal.init(elems);
});
//dropdown
document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll(".dropdown-trigger");
  M.Dropdown.init(elems, {
    alignment: "center",
    hover: true
  });
});

const $chkbx = document.querySelector("#indeterminate-checkbox");
(function() {
  const paid = document.querySelector("#paidEntry");
  const price = document.querySelector("#test");
  if ($chkbx) {
    $chkbx.onclick = function() {
      if (this.checked) {
        paid.value = true;
      }
    };
    paid.value = $chkbx.value;
  }
})();

if ($chkbx) {
  $chkbx.addEventListener("click", () => {
    document.querySelector("#priceBlock").classList.toggle("hideInput");
  });
}
