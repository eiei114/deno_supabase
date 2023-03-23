# DenoでSupabaseを操作するサンプル

## 概要
- DBからデータを取得する
- DBにデータを追加する

## 使い方
### fetch
```
if (req.method === "GET" && pathname === "/fetch-posts") {
        const {data, error} = await supabase
            .from('post')
            .select('*') //取得するデータを設定する

        if (error) {
            console.log("このエラーは"+error);
            return new Response(JSON.stringify({ error: "An error occurred while processing your request" }), { status: 500, headers: { "content-type": "application/json" } });
        } else {
            console.log("成功したかも"+JSON.stringify(data));
            //dataをJSONに変換して返す

            return  new Response(JSON.stringify(data),{ headers: { "content-type": "application/json" } });
        }
    }
```

### insert
```
if (req.method === "POST" && pathname === "/register-post") {
        const responseData = await req.json();
        console.log(responseData.date)
        const {data, error} = await supabase
            .from('post')
            .insert({ //新たに追加するデータ
                username: responseData.username,
                title: responseData.title,
                date: responseData.date,
                description: responseData.description,
                participants: 0
            })

        if (error) {
            console.log("このエラーは"+error);
            return new Response(JSON.stringify({ error: "An error occurred while processing your request" }), { status: 500, headers: { "content-type": "application/json" } });
        } else {
            console.log("成功したかも"+responseData.date);

            return new Response(JSON.stringify(responseData),{ headers: { "content-type": "application/json" } });
        }
    }
```