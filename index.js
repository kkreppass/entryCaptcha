import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
let csrf = '';
let body = '';
async function getCookie() {
  csrf = await fetch("https://playentry.org");
  body = await csrf.text();
}
getCookie()
  .then(() => {
    const cookie = csrf.headers.get('set-cookie');
    console.log(cookie);
    const index = body.indexOf("csrf-token") + 21;
    const csrfToken = body.slice(index, index + 36);
    const app = express();
    const corsOptions = {
      origin: '*',
      optionsSuccessStatus: 200
    }
    app.use(cors(corsOptions));

    app.get('/', (req, res) => {
      res.send("server is working as i think :)")
    });

    app.get('/captcha', (req, res) => {
      fetch("https://playentry.org/graphql", {
        "headers": {
          "content-type": "application/json",
          "CSRF-Token": `${csrfToken}`,
          "cookie": `${cookie}`
        },
        "body": "{\"query\":\"\\n    query ($captchaType: String!) {\\n        getCaptchaData (captchaType: $captchaType) {\\n            \\n    status\\n    result\\n\\n        }\\n    }\\n\",\"variables\":{\"captchaType\":\"image\"}}",
        "method": "POST",
      }).then(d => d.text())
        .then(d => res.json(JSON.parse(d)))//captcha 불러오기
    });

    app.get('/confirm', (req, res) => {
      let captchaValue = req.query.v;
      let captchaKey = req.query.k;
      fetch("https://playentry.org/graphql", {
        "headers": {
          "content-type": "application/json",
          "CSRF-Token": `${csrfToken}`,
          "cookie": `${cookie}`
        },
        "body": `{\"query\":\"\\n    mutation (\\n        $captchaValue: String!\\n        $captchaKey: String!    \\n        $captchaType: String!\\n    ) {\\n        setSnsMemberCaptcha (\\n            captchaValue: $captchaValue\\n            captchaKey: $captchaKey\\n            captchaType: $captchaType\\n        ) {\\n            \\n    status\\n    result\\n\\n        }\\n    }\\n\",\"variables\":{\"captchaValue\":\"${captchaValue}\",\"captchaKey\":\"${captchaKey}\",\"captchaType\":\"image\"}}`,
        "method": "POST",
      }).then(d => d.text())
        .then(d => res.json(JSON.parse(d)))//captcha 확인
    });


    app.listen(3000, () => {
      console.log('server running!');
    })
  })
