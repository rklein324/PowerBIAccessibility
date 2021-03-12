window.onload = function () {
    btn = document.getElementById("runAgainBtn");
    btn.addEventListener('click', function() {
      window.top.close();
      chrome.windows.create({url: "popup.html", type: "popup", height: 250, width: 200, left: 940, top: 65});
    });

    btn1 = document.getElementById("bdrpdwn1");
    div1 = document.getElementById("drpdwn1");
    btn1.addEventListener('click', function() {
      toggleActive(div1);
    });

    btn2 = document.getElementById("bdrpdwn2");
    div2 = document.getElementById("drpdwn2");
    btn2.addEventListener('click', function() {
      toggleActive(div2);
    });

    btn3 = document.getElementById("bdrpdwn3");
    div3 = document.getElementById("drpdwn3");
    btn3.addEventListener('click', function() {
      toggleActive(div3);
    });
}

function toggleActive(element) {
    element.classList.toggle("active");
}
