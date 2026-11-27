import http from "k6/http";
import { sleep, check } from "k6";

//Runs for long periods to detect leaks and slowdown
export const options = {
  vus: 20,
  duration: "2m",  // you can set to 10m or 1h for real scenarios
  thresholds: {
    http_req_duration: ["avg<300", "p(95)<500"],
    http_req_failed: ["rate<0.01"],
    checks: ["rate==1"],
  },
};

export default function () {
  const res = http.get("http://localhost:3000/users");
  check(res, { "status 200": (r) => r.status === 200 });
  sleep(1);
}