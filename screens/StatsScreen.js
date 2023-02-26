import * as React from "react";
import GoogleFit from "../components/GoogleFit/GoogleFit";
import { supabase, getDayData } from "../utils/api";
import "moment/locale/fr";
import moment from "moment/moment";

export default function StatsScreen() {
    const [data, setData] = React.useState({
        totalJade: 0,
        totalRama: 0,
        lectures: [],
        randomMessage: [],
        total: 1,
        timeData: { datasets: [{ data: [] }] },
        nbTurn: 0,
        memories1: [],
        memories2: [],
    });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        getData();
    }, []);

    async function getData() {
        setLoading(true);
        let { count: totalRama } = await supabase
            .from("messages")
            .select("author", { count: "exact", head: true })
            .eq("author", 1);
        const { count: totalJade } = await supabase
            .from("messages")
            .select("author", { count: "exact", head: true })
            .eq("author", 2);
        let total = totalRama + totalJade;
        let random = Math.floor(Math.random() * Math.floor(total - 1)) + 1;
        setData(Object.assign({}, data, { totalJade, totalRama, total }));
        setLoading(false);
        const { data: randomMessage } = await supabase
            .from("random_notes")
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
            .limit(1);
        const lastYear = moment().add(-1, "y").startOf("day").format("YYYY-MM-DD");
        const lastYear2 = moment().add(-2, "y").startOf("day").format("YYYY-MM-DD");
        const lastYear3 = moment().add(-3, "y").startOf("day").format("YYYY-MM-DD");
        const { data: memories1 } = await getDayData(lastYear);
        const { data: memories2 } = await getDayData(lastYear2);
        const { data: memories3 } = await getDayData(lastYear3);

        setData(
            Object.assign({}, data, {
                totalRama,
                totalJade,
                total,
                randomMessage,
                memories1,
                memories2,
                memories3,
            }),
        );
    }

    return <GoogleFit refresh={getData} data={data} loading={loading} />;
}
