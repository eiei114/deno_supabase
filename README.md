# DenoでSupabaseを操作するサンプル

## 概要
- DBからデータを取得する
- DBにデータを追加する

## 準備

1. GitHubのアカウントを作成
2. [Supabase](https://supabase.com/)にGitHubでログイン
3. project test1 を作成し、SUPABASE_URL と SUPABASE_KEY を設定
```sh
export SUPABASE_URL=***
export SUPABASE_KEY=***
```
4. table post を作成し、RLS(Row Level Security)はひとまずdisabledにする
5. table postに、下記の項目を追加
```
username :text
title :text
date :timestamptz
description :text
participants :numeric
```
6. サーバーを起動する
```sh
deno run server.js
```
7. ブラウザで [http://localhost:8000/](http://localhost:8000/) を開く

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