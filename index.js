import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
let csrf = '';
let body = '';
async function getCookie ()  {
  csrf = await fetch("https://playentry.org");
  body = await csrf.text();
  console.log(1)
}
getCookie()
.then(()=>{
console.log(2)
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
  res.send("/profile/유저id 로 get 요청을 보내세요(json)")
})
app.get('/profile/:id', (req, res) => {
fetch("https://playentry.org/graphql", {
  "headers": {
    "content-type": "application/json",
    "CSRF-Token": `${csrfToken}`,
    "cookie": `${cookie}`
  },
  "body": `{\"query\":\"\\n    query FIND_USERSTATUS_BY_USERNAME($id: String) {\\n        userstatus(id: $id) {\\n            id\\n            nickname\\n            username\\n            description\\n            shortUrl\\n            profileImage {\\n                \\n    id\\n    name\\n    label {\\n        \\n    ko\\n    en\\n    ja\\n    vn\\n\\n    }\\n    filename\\n    imageType\\n    dimension {\\n        \\n    width\\n    height\\n\\n    }\\n    trimmed {\\n        filename\\n        width\\n        height\\n    }\\n\\n            }\\n            coverImage {\\n                \\n    id\\n    name\\n    label {\\n        \\n    ko\\n    en\\n    ja\\n    vn\\n\\n    }\\n    filename\\n    imageType\\n    dimension {\\n        \\n    width\\n    height\\n\\n    }\\n    trimmed {\\n        filename\\n        width\\n        height\\n    }\\n\\n            }\\n            role\\n            studentTerm\\n            status {\\n                project\\n                projectAll\\n                study\\n                studyAll\\n                community {\\n                    qna\\n                    tips\\n                    free\\n                }\\n                following\\n                follower\\n                bookmark {\\n                    project\\n                    study\\n                }\\n                userStatus\\n            }\\n        }\\n    }\\n\",\"variables\":{\"id\":\"${req.params.id}\"}}`,
  "method": "POST",
})
  .then(d=>d.text())
  .then(d=>res.json(JSON.parse(d)))
})



app.listen(3000, () => {
  console.log('server running!');
})
})
