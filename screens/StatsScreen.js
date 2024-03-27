import * as React from "react";
import GoogleFit from "../components/GoogleFit/GoogleFit";
import { supabase, getDayData, getDayYearData } from "../utils/api";
import "moment/locale/fr";

export default function StatsScreen() {
    const [data, setData] = React.useState({
        totalJade: 0,
        totalRama: 0,
        lectures: [],
        randomMessage: [],
        total: 1,
        timeData: { datasets: [{ data: [] }] },
        nbTurn: 0,
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
        const memories = await getDayYearData()
        setData(
            Object.assign({}, data, {
                totalRama,
                totalJade,
                total,
                randomMessage,
                memories : memories.data
            }),
        );
    }

    return <GoogleFit refresh={getData} data={data} loading={loading} />;
}
