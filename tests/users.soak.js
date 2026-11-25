import http from "k6/http";
import { sleep, check } from "k6";

//Runs for long periods to detect leaks and slowdown
export const options = {
  vus: 20,
  duration: "2m",  // you can set to 10m or 1h for real scenarios
};

export default function () {
  const res = http.get("http://localhost:3000/users");
  check(res, { "status 200": (r) => r.status === 200 });
  sleep(1);
}