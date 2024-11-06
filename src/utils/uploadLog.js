import { getLocationIdDoseNotExistSet, credentialScan } from "./credential";

const logUrl = "https://n26a_backend.mirai-th-kakenn.workers.dev/number_of_people";

function sendLog(count, token) {
  const logData = {
    locateId: parseInt(getLocationIdDoseNotExistSet()),
    srcTypeId: 1,
    count: count
  };
  const req = fetch(logUrl, {
    body: JSON.stringify(logData),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    keepalive: true
  });
  req.then(v => {
    return v.json();
  }).then(resBody => {
    console.log(resBody);
  });
}

function Do() {
  credentialScan().then(token => {
    sendLog(parseInt(window.localStorage.getItem("person_count_v1") || "0"), token);
  });
}

setInterval(Do, 1000 * 60 * 4);
Do();