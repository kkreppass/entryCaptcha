# dut_api
ent2.ml을 위한 유저 정보 api입니다.

cors, csrftoken, xtoken 걱정 없이 간편하게 유저 정보를 불러올 수 있습니다.

# how to
./profile/유저id 링크로 get 요청을 보내세요.

예시
```
fetch('https://dut-api-atobe1108.vercel.app/profile/62e0f3af3d80d5006290ab89').then(r=>r.json()).then(r=>console.log(r))
```
