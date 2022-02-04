import * as React from "react";
import GoogleFit from "../components/GoogleFit/GoogleFit";
import { get } from "../utils/api";
import "moment/locale/fr";
import moment from "moment/moment";

export default function StatsScreen() {
    const [data, setData] = React.useState({
        count: {},
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
        let nbPerAuthor = await get('?h={"$groupby":["author"],"$aggregate":["COUNT:notes"]}&totals=true');
        let total = nbPerAuthor.totals.total;
        let random = Math.floor(Math.random() * Math.floor(total - 1)) + 1;
        setData(Object.assign({}, data, { count: nbPerAuthor.data, total }));
        setLoading(false);
        let randomMessage = await get("?skip=" + random + "&max=1");
        let nbTurn = await get("/5eb3f781423f27520001f0b4", "/stats");
        const lastYear = moment().add(-1, "y").startOf("day").format("YYYY-MM-DD");
        const lastYear2 = moment().add(-2, "y").startOf("day").format("YYYY-MM-DD");

        const memories1 = await get(`?q={"date":{"$gte":{"$date":"${lastYear}"},"$lte":{"$date":"${lastYear}"}}}`);
        const memories2 = await get(`?q={"date":{"$gte":{"$date":"${lastYear2}"},"$lte":{"$date":"${lastYear2}"}}}`);
        setData(
            Object.assign({}, data, {
                count: nbPerAuthor.data,
                total,
                randomMessage,
                nbTurn,
                memories1,
                memories2,
            }),
        );
    }

    return <GoogleFit refresh={getData} data={data} loading={loading} />;
}
