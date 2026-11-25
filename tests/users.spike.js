import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: "2s", target: 10 },   // normal traffic
        { duration: "2s", target: 500 },  // sudden massive spike
        { duration: "2s", target: 10 },   // return to normal
    ],

    thresholds: {
        http_req_duration: ['avg<300', 'p(95)<500'],
        http_req_failed: ['rate<0.01'],
        checks: ['rate==1'],
    },
};


export default function () {
    const res = http.get('http://localhost:3000/users');

    check(res, {
        'status is 200': (r) => r.status === 200,
    });

    sleep(1);
}