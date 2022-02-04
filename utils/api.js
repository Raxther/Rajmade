const baseUrl = "https://rajmade-7d1e.restdb.io/rest/";

let myHeaders = new Headers();
myHeaders.append("x-apikey", "5e958416436377171a0c2353");
myHeaders.append("Content-Type", "application/json");

let notificationHeader = new Headers();
notificationHeader.append("Content-Type", "application/json");
notificationHeader.append("Accept", "application/json");
notificationHeader.append("Accept-encoding", "gzip, deflate");

let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
};

const handleRequest = async request => {
    if (request.status === 400) {
        let res = await request.json();
        throw new Error(res.message);
    } else {
        const res = await request.json();
        return res;
    }
};

let getHeaders = () => {
    return myHeaders;
};

export async function get(url, annexe = "notes") {
    let request = await fetch(baseUrl + annexe + "\n" + url, {
        headers: getHeaders(),
    });
    return handleRequest(request);
}

export async function send(url, fields, method = "POST", annexe = "notes") {
    let request = await fetch(baseUrl + annexe + "\n" + url, {
        method,
        body: JSON.stringify(fields),
        headers: getHeaders(),
    });
    return handleRequest(request);
}
