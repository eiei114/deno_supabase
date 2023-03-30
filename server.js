import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { serve } from "https://deno.land/std@0.138.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";
import "https://deno.land/std@0.167.0/dotenv/load.ts";

const url = Deno.env.get("SUPABASE_URL");
const key = Deno.env.get("SUPABASE_KEY");

const supabase = createClient(url, key)


async function fetchPosts() {
    const { data, error } = await supabase.from("post").select("*");
    return { data, error };
}

async function registerPost(postData) {
    const { error } = await supabase.from("post").insert(postData);
    return { error };
}

async function getParticipants(id) {
    const { data: participants, error } = await supabase
        .from("post")
        .select("participants")
        .eq("id", id);
    return { participants, error };
}

async function updateParticipants(id, newCount) {
    const { error } = await supabase
        .from("post")
        .update({ participants: newCount })
        .eq("id", id);
    return { error };
}

async function handleError(error) {
    console.log("このエラーは" + JSON.stringify(error, null, 2));
    return new Response(JSON.stringify({ error: "An error occurred while processing your request" }), {
        status: 500,
        headers: { "content-type": "application/json" }
    });
}

serve(async req => {
    const pathname = new URL(req.url).pathname;
    console.log(pathname);

    if (req.method === "GET" && pathname === "/fetch-posts") {
        const { data, error } = await fetchPosts();
        if (error) return handleError(error);

        console.log("成功したかも" + JSON.stringify(data));
        return new Response(JSON.stringify(data), { headers: { "content-type": "application/json" } });
    }

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

    return serveDir(req, {
        fsRoot: "public",
        urlRoot: "",
        showDirListing: true,
        enableCors: true,
    });
});