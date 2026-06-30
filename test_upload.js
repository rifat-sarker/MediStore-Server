const fs = require('fs');

async function run() {
  const loginRes = await fetch("http://localhost:5001/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@medistore.com", password: "Admin@12345" })
  }).then(res => res.json());
  
  const token = loginRes.data.accessToken;
  
  fs.writeFileSync("dummy.txt", "hello world");
  
  const formData = new FormData();
  const file = new Blob([fs.readFileSync("dummy.txt")], { type: "text/plain" });
  formData.append("file", file, "dummy.txt");
  
  const uploadRes = await fetch("http://localhost:5001/api/v1/upload", {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body: formData
  });
  
  console.log(await uploadRes.text());
}
run();
