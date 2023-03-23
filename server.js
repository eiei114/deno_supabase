import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { serve } from "https://deno.land/std@0.138.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";
import "https://deno.land/std@0.167.0/dotenv/load.ts";

const url = Deno.env.get("SUPABASE_URL");
const key = Deno.env.get("SUPABASE_KEY");

const supabase = createClient(url,key)


serve(async req => {
    const pathname = new URL(req.url).pathname;
    console.log(pathname);

    if (req.method === "GET" && pathname === "/fetch-posts") {
        const {data, error} = await supabase
            .from('post')
            .select('*')

        if (error) {
            console.log("このエラーは"+error);
            return new Response(JSON.stringify({ error: "An error occurred while processing your request" }), { status: 500, headers: { "content-type": "application/json" } });
        } else {
            console.log("成功したかも"+JSON.stringify(data));
            //dataをJSONに変換して返す

            return  new Response(JSON.stringify(data),{ headers: { "content-type": "application/json" } });
        }
    }


    //POSTメソッドで/register-postにアクセスした場合
    if (req.method === "POST" && pathname === "/register-post") {
        const responseData = await req.json();
        console.log(responseData.date)
        const {data, error} = await supabase
            .from('post')
            .insert({
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

    return serveDir(req, {
        fsRoot: "public",
        urlRoot: "",
        showDirListing: true,
        enableCors: true,
    });
});