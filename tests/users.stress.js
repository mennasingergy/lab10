import http from "k6/http";
import { check } from "k6";

//How much load can the system handle before it breaks?
export const options = {
    stages: [
        { duration: "10s", target: 200 },  // heavy but usually OK
        { duration: "10s", target: 500 },  // getting intense
        { duration: "20s", target: 500 },  // Sustained load
        { duration: "10s", target: 0 }, // gradually reduce load to find the breaking point
    ],
};

export default function () {
    const res = http.get("http://localhost:3000/users");

    check(res, {
        "status 200": (r) => r.status === 200,
    });
    sleep(1);
}