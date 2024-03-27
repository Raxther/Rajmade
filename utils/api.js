import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";
import moment from "moment/moment";

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

export const getDayYearData = async () =>  {
    // Initialize an array to store messages for all years

    let allMessages = [];

    // Retrieve the current year
    const currentYear = new Date().getFullYear();

    // Loop through each year from the current year to a certain number of years back (e.g., 5 years)
    for (let year = currentYear - 1; year >= currentYear - 10; year--) {
        // Construct the start and end date for the given day in the current year
        let date = new Date()
        date.setFullYear(year)
        date = date.toISOString()
        const day = moment(date).startOf("day").format("YYYY-MM-DD")
        // Retrieve messages for the current year and day
        let { data: messages, error } = await supabase
            .from("messages")
            .select(`
                message,
                date,
                id,
                author (
                    name
                )
            `)
            .order("date", { ascending: false })
            .lte("date", day)
            .gte("date", day);

        if (error) {
            console.error("Error fetching messages:", error.message);
            return { error: error.message };
        }

        // Add messages for the current year to the array
        allMessages.push({ year: year, messages: messages });
    }
    // Return all messages for each year
    return { data: allMessages };
}
