// const BASEURL =
//   "https://kelpshealthcare.com";

const SWWrong = "Something went wrong!";
const KELPS_BASE_URL=JSON.parse(localStorage.getItem("KELPS_BASE_URL"))
async function login(event) {
  event.preventDefault();
  const email = document.getElementById("login_email_or_phone").value;
  const password = document.getElementById("login_password").value;

  if (!email || !password) {
    document.getElementById("response").innerText =
      "Please fill in all fields.";

    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    document.getElementById("response").innerText =
      "Please enter a valid email address.";
    return;
  }

  try {
    const payload = { email, password };

    const response = await fetch(`${KELPS_BASE_URL}/user_login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const responseData = await response.json();
      if (responseData?.status) {
        console.log(responseData);
        // localStorage.setItem("token", responseData?.data?.token)
        localStorage.setItem("token", responseData?.data?.password);
        localStorage.setItem("userData", responseData?.data);
        document.getElementById("response").innerText = "";
        setTimeout(() => {
          window.location.href = "index.html";
        }, 500);
      } else {
        throw new Error(responseData?.message);
      }
    }
  } catch (err) {
    document.getElementById("response").innerText = err?.message
      ? err?.message
      : SWWrong;
    console.error("Error:", err);
  }
}

async function register(event) {
  event.preventDefault();
  const email = document.getElementById("emailReg").value;
  const password = document.getElementById("passwordReg").value;

  if (!email || !password) {
    document.getElementById("responseReg").innerText =
      "Please fill in all fields.";

    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  document.getElementById("responseReg").innerText =
    "Please enter a valid email address.";
  return;
}

  try {
    const payload = { email, password };

    const response = await fetch(`${KELPS_BASE_URL}/user_register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        name: "None",
        state: "None",
        district: "None",
      }),
    });

    if (response.ok) {
      const responseData = await response.json();
      if (responseData?.status) {
        console.log(responseData);
        document.getElementById("responseReg").innerText = "";
        document.getElementById("responseReg2").innerText =
          "Registration Success";
        setTimeout(() => {
          window.location.href = "auth.html";
        }, 1000);

      } else {
        throw new Error(responseData?.message);
      }
    }
  } catch (err) {
    document.getElementById("responseReg").innerText = err?.message
      ? err?.message
      : SWWrong;
    console.error("Error:", err);
  }
}

function checkLoginStatus() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "auth.html";
  } else {
    console.log("User is logged in.");
  }
}
function redirectToHome() {
  const token = localStorage.getItem("token");

  if (token) {
    window.location.href = "index.html";
  }
}

function logout() {
  const token= localStorage.getItem("token");
  if(token){
    localStorage.removeItem("token");
    localStorage.removeItem("data");
  }

  window.location.href = "auth.html";
}
