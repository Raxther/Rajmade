import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://guwejrpkgiyanvigovbl.supabase.co";
const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMjAxNTE0NSwiZXhwIjoxOTM3NTkxMTQ1fQ.JI5iOVNCL177xWLBqjDqSuQ3Faxvq2MaY8SFGVSukH0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

let myHeaders = new Headers();
myHeaders.append("x-apikey", "5e958416436377171a0c2353");
myHeaders.append("Content-Type", "application/json");

let notificationHeader = new Headers();
notificationHeader.append("Content-Type", "application/json");
notificationHeader.append("Accept", "application/json");
notificationHeader.append("Accept-encoding", "gzip, deflate");

export const getDayData = async (day = new Date().toISOString()) => {
    let { data: messages, error } = await supabase
        .from("messages")
        .select(
            `
            message,
            date,
            id,
            author (
              name
            )
      `,
        )
        .order("date", { ascending: false })
        .lte("date", day)
        .gte("date", day);
    return { data: messages, error };
};
