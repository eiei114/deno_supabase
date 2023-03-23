# DenoでSupabaseを操作するサンプル

## 概要
- DBからデータを取得する
- DBにデータを追加する

## 使い方
### fetch
```
if (req.method === "GET" && pathname === "/fetch-posts") {
        const { data, error } = await fetchPosts();
        if (error) return handleError(error);

        console.log("成功したかも" + JSON.stringify(data));
        return new Response(JSON.stringify(data), { headers: { "content-type": "application/json" } });
    }
```

### insert
```
if (req.method === "POST" && pathname === "/register-post") {
        const requestData = await req.json();
        const postData = {
            username: requestData.username,
            title: requestData.title,
            date: requestData.date,
            description: requestData.description,
            participants: 0
        };

        const { error } = await registerPost(postData);
        if (error) return handleError(error);

        console.log("成功したかも" + requestData.date);
        return new Response(JSON.stringify(requestData), { headers: { "content-type": "application/json" } });
    }
```

## Update
```
 if (req.method === "POST" && pathname === "/add-participants") {
        const requestData = await req.json();

        const { participants, error1 } = await getParticipants(requestData);
        if (error1) return handleError(error1);

        const newParticipantCount = participants[0].participants + 1;
        const { error } = await updateParticipants(requestData, newParticipantCount);
        if (error) return handleError(error);

        console.log("成功したかも" + requestData);
        return new Response(JSON.stringify(requestData), { headers: { "content-type": "application/json" } });
    }
```