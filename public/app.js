var url = "http://localhost:5000";
var socket = io(url);

const sendMessage = () => {
  let userMessage = document.getElementById("userMsg").value;

  // socket.emit("chatMessage", userMsg);
  const Http = new XMLHttpRequest();
  Http.open("POST", url + "/chat");
  Http.setRequestHeader("Content-Type", "application/json");

  Http.send(
    JSON.stringify({
      userMessage: userMessage,
    })
  );

  Http.onreadystatechange = (e) => {
    if (Http.readyState === 4) {
      let jsonRes = JSON.parse(Http.responseText);
      console.log("posted success");
    }
  };

  document.getElementById("userMsg").value = "";
  return false;
};
const getMessage = () => {
  const Http = new XMLHttpRequest();
  Http.open("GET", url + "/chat");
  Http.setRequestHeader("Content-Type", "application/json");

  Http.send();

  Http.onreadystatechange = (e) => {
    if (Http.readyState === 4) {
      let jsonRes = JSON.parse(Http.responseText);
      console.log(jsonRes);
      for (let i = 0; i < jsonRes.length; i++) {
        let newMessage = document.createElement("div");
        newMessage.innerHTML = `<p>${jsonRes[i].userMessage}</p>`;
        document.getElementById("chat-messages").appendChild(newMessage);
      }
    }
  };
  // const div = document.createElement("div");
  // div.innerHTML = `<p>${message}</p>`;
  // document.getElementById("chat-messages").appendChild(div);
};

socket.on("NEW_MESSAGE", (msg) => {
  // console.log(msg);
  let resFromSv = JSON.parse(msg);
  console.log(resFromSv);
  const div = document.createElement("div");
  div.innerHTML = `<p>${resFromSv.userMessage}</p>`;
  document.getElementById("chat-messages").appendChild(div);
});
