$("#invalid").hide();
$("#valid").hide();
let loggedIn = false;
let user = window.localStorage.getItem('user');
if(user){
  loggedIn = true;
} else {
  loggedIn = false;
}

if(loggedIn){
  $('.logged-in').show();
  $('.logged-out').hide();
} else {
  $('.logged-in').hide();
  $('.logged-out').show();
}
$(document).ready(function() {
  // Utility Function
  // URL Params
  const urlParams = new URLSearchParams(window.location.search);

  // Get data from database
  $.ajax({
    url: "http://localhost:3000/designs",
    method: "GET",
    success: function(response) {
      let filtered = response.filter(p => p.isDeleted === "false");
      let mapped = filtered.reverse().map(style => {
        return `<div class="col-md-4 my-2">
        <div class="card">
          <img src=${style.image} alt="card" class="card-img">
          <div class="card-body">
            <h5 class="card-title">${style.name} <br><small>${
          style.designer
        }</small></h5>
            <p class="card-text">
              <small>${style.category}</small>
            </p>
            <p>${parseFloat(style.price).toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN"
            })}</p><a href="/design.html?id=${
          style.id
        }" class="btn btn-secondary btn-lg">View Design</a></div>
        </div>
      </div>`;
      });
      $("#designsDisplay").html(mapped);
    }
  });

  // Create design function
  $("#createDesignForm").on("submit", function(e) {
    e.preventDefault();
    let name = $("#name").val();
    let designer = $("#designer").val();
    let category = $("#category").val();
    let description = $("#description").val();
    let image = $("#image").val();
    let price = $("#price").val();
    let isDeleted = false;

    $.ajax({
      url: "http://localhost:3000/designs",
      method: "POST",
      data: {
        name,
        designer,
        category,
        description,
        image,
        price,
        isDeleted
      }
    }).done(function(res) {
      console.log(res);

      (window.location.href = `/design.html?id=${res.id}`),
        alert("Design Successfully Created");
    });
  });

  // Get Single Design by ID
  let id = urlParams.get("id");
  if (id != null) {
    $.ajax({
      url: `http://localhost:3000/designs/${id}`,
      method: "GET",
      success: function(response) {
        let { name, designer, category, description, image, price } = response;
        $("h1#designName").text(name);
        $("span#designerName").text(designer);
        $("span#category").text(category);
        $("p#description").text(description);
        $("p#price").text(
          parseFloat(price).toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN"
          })
        );
        $("#designImg").attr("src", image);
        $("#updateLink").attr("href", `/update-design.html?id=${id}`);

        // Assign values to form fields
        $("#name").attr("value", name);
        $("#designer").attr("value", designer);
        //$(`#category`).val(category);
        $("#description").text(description);
        $("#image").attr("value", image);
        $("#price").attr("value", price);
      }
    });
  }

  // Handle Update
  $("#updateForm").on("submit", function(e) {
    e.preventDefault();
    let name = $("#name").val();
    let designer = $("#designer").val();
    let category = $("#category").val();
    let description = $("#description").val();
    let image = $("#image").val();
    let price = $("#price").val();
    $.ajax({
      url: `http://localhost:3000/designs/${id}`,
      method: "PATCH",
      data: {
        name,
        designer,
        category,
        description,
        image,
        price
      }
    }).done(function() {
      window.location.href = `/design.html?id=${id}`;
      alert("Design Successfully Updated");
    });
  });

  // Delete Design
  $("#deleteDesign").on("click", function() {
    let confirmed = confirm("Confirm Delete");

    if (confirmed) {
      $.ajax({
        url: `http://localhost:3000/designs/${id}`,
        method: "PATCH",
        data: {
          isDeleted: true
        }
      }).done(function() {
        window.location.href = `/`;
        alert("Design Successfully Deleted");
      });
    }
  });

  // Login functionality
  $("#loginForm").on("submit", e => {
    e.preventDefault();
    let username = $("#username").val();
    let password = $("#password").val();
    $.ajax({
      url: `http://localhost:3000/users?username=${username}&password=${password}`,
      method: "GET"
    }).done(response => {
      if (response) {
        window.localStorage.setItem("user", username);
        $("#valid").show();
        $("#invalid").hide();
        window.location = "/";
      } else {
        $("#valid").hide();
        $("#invalid").show();
      }
    });
  });
  // Log Out functionality
  $('#logout').on('click', () => {
    window.localStorage.removeItem('user');
    window.location = "/login.html";
  })
});
