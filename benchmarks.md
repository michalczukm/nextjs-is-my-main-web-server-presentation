# Benchmarks

Each benchmark was made with [AutoCannon](https://github.com/mcollina/autocannon) with the following params:

- `-c 100` - 100 concurrent connections
- `-d 40` - 40 seconds duration
- `-p 10` - 10 pipelining factor (the number of [pipelined requests](https://en.wikipedia.org/wiki/HTTP_pipelining) for each connection. So sending multiple requests at the same time without waiting for the response.)

It tested `GET /api/posts` route with simple auth based on JWT.

- Auth middleware code was same for each project.
- Same JWT token was used for each benchmark.

```sh
npx autocannon -c 100 -d 40 -p 10 <SERVICE_URL>/api/posts -H Authorization="Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJvcmc6bWljaGFsY3p1a206aXNzdWVyIiwiYXVkIjoib3JnOm1pY2hhbGN6dWttOmF1ZGllbmNlIn0.CHaB_qZjIuKMYc487Jscj-KCyj1OuW8-e1R1d1n0KucsF2t_XtXNDzjOk7qowhpVLwF_GBzgUvPYoCi3BUmSyQ"
```

## Machine

All tests were made on the same machine:

- CPU: Apple M1
- RAM: 16 GB
- macOS: Ventura 13.4
- node.js: v20.10.0

## Nextjs raw app

- using `app` and route handlers

```sh
➜  benchmarks git:(master) ✗ npx autocannon -c 100 -d 40 -p 10 localhost:3010/api/posts -H Authorization="Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJvcmc6bWljaGFsY3p1a206aXNzdWVyIiwiYXVkIjoib3JnOm1pY2hhbGN6dWttOmF1ZGllbmNlIn0.CHaB_qZjIuKMYc487Jscj-KCyj1OuW8-e1R1d1n0KucsF2t_XtXNDzjOk7qowhpVLwF_GBzgUvPYoCi3BUmSyQ"

Running 40s test @ http://localhost:3010/api/posts
100 connections with 10 pipelining factor

┌─────────┬────────┬────────┬────────┬─────────┬───────────┬───────────┬─────────┐
│ Stat    │ 2.5%   │ 50%    │ 97.5%  │ 99%     │ Avg       │ Stdev     │ Max     │
├─────────┼────────┼────────┼────────┼─────────┼───────────┼───────────┼─────────┤
│ Latency │ 122 ms │ 496 ms │ 659 ms │ 1532 ms │ 508.25 ms │ 595.55 ms │ 9935 ms │
└─────────┴────────┴────────┴────────┴─────────┴───────────┴───────────┴─────────┘
┌───────────┬─────────┬─────────┬─────────┬────────┬─────────┬────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%  │ Avg     │ Stdev  │ Min     │
├───────────┼─────────┼─────────┼─────────┼────────┼─────────┼────────┼─────────┤
│ Req/Sec   │ 1,354   │ 1,354   │ 1,782   │ 1,982  │ 1,791.8 │ 112.88 │ 1,354   │
├───────────┼─────────┼─────────┼─────────┼────────┼─────────┼────────┼─────────┤
│ Bytes/Sec │ 5.26 MB │ 5.26 MB │ 6.93 MB │ 7.7 MB │ 6.96 MB │ 438 kB │ 5.26 MB │
└───────────┴─────────┴─────────┴─────────┴────────┴─────────┴────────┴─────────┘

Req/Bytes counts sampled once per second.
# of samples: 40

73k requests in 40.04s, 278 MB read
330 errors (330 timeouts)
```

## next-connect app

- using `app` and route handlers
- wrap route handlers with `next-connect`

```sh
➜  benchmarks git:(master) ✗ npx autocannon -c 100 -d 40 -p 10 localhost:3011/api/posts -H Authorization="Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJvcmc6bWljaGFsY3p1a206aXNzdWVyIiwiYXVkIjoib3JnOm1pY2hhbGN6dWttOmF1ZGllbmNlIn0.CHaB_qZjIuKMYc487Jscj-KCyj1OuW8-e1R1d1n0KucsF2t_XtXNDzjOk7qowhpVLwF_GBzgUvPYoCi3BUmSyQ"

Running 40s test @ http://localhost:3011/api/posts
100 connections with 10 pipelining factor

┌─────────┬────────┬────────┬────────┬─────────┬──────────┬───────────┬─────────┐
│ Stat    │ 2.5%   │ 50%    │ 97.5%  │ 99%     │ Avg      │ Stdev     │ Max     │
├─────────┼────────┼────────┼────────┼─────────┼──────────┼───────────┼─────────┤
│ Latency │ 159 ms │ 516 ms │ 573 ms │ 1565 ms │ 510.5 ms │ 546.49 ms │ 9822 ms │
└─────────┴────────┴────────┴────────┴─────────┴──────────┴───────────┴─────────┘
┌───────────┬────────┬────────┬────────┬─────────┬──────────┬────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%   │ Avg      │ Stdev  │ Min    │
├───────────┼────────┼────────┼────────┼─────────┼──────────┼────────┼────────┤
│ Req/Sec   │ 1,080  │ 1,080  │ 1,879  │ 2,000   │ 1,857.25 │ 147.96 │ 1,080  │
├───────────┼────────┼────────┼────────┼─────────┼──────────┼────────┼────────┤
│ Bytes/Sec │ 4.2 MB │ 4.2 MB │ 7.3 MB │ 7.77 MB │ 7.22 MB  │ 575 kB │ 4.2 MB │
└───────────┴────────┴────────┴────────┴─────────┴──────────┴────────┴────────┘

Req/Bytes counts sampled once per second.
# of samples: 40

75k requests in 40.05s, 289 MB read
180 errors (180 timeouts)
```

## Nextjs with pages + API routes

- using `pages` and API route handlers

```
benchmarks git:(master) ✗ npx autocannon -c 100 -d 40 -p 10 localhost:3009/api/posts -H Authorization="Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJvcmc6bWljaGFsY3p1a206aXNzdWVyIiwiYXVkIjoib3JnOm1pY2hhbGN6dWttOmF1ZGllbmNlIn0.CHaB_qZjIuKMYc487Jscj-KCyj1OuW8-e1R1d1n0KucsF2t_XtXNDzjOk7qowhpVLwF_GBzgUvPYoCi3BUmSyQ"
Running 40s test @ http://localhost:3009/api/posts
100 connections with 10 pipelining factor


┌─────────┬───────┬────────┬────────┬────────┬───────────┬───────────┬─────────┐
│ Stat    │ 2.5%  │ 50%    │ 97.5%  │ 99%    │ Avg       │ Stdev     │ Max     │
├─────────┼───────┼────────┼────────┼────────┼───────────┼───────────┼─────────┤
│ Latency │ 96 ms │ 340 ms │ 363 ms │ 370 ms │ 333.95 ms │ 406.42 ms │ 9675 ms │
└─────────┴───────┴────────┴────────┴────────┴───────────┴───────────┴─────────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬─────────┬────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev  │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼────────┼─────────┤
│ Req/Sec   │ 1,957   │ 1,957   │ 2,973   │ 3,131   │ 2,977.8 │ 186.95 │ 1,957   │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼────────┼─────────┤
│ Bytes/Sec │ 7.56 MB │ 7.56 MB │ 11.5 MB │ 12.1 MB │ 11.5 MB │ 722 kB │ 7.56 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴────────┴─────────┘

Req/Bytes counts sampled once per second.
# of samples: 40

120k requests in 40.04s, 460 MB read
```

## Nextjs with request pattern matching

- using `pages` and API route handlers
- exposes single endpoint and uses `ts-pattern` to match requests

```sh
➜  benchmarks git:(master) ✗ npx autocannon -c 100 -d 40 -p 10 localhost:3012/api/posts -H Authorization="Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJvcmc6bWljaGFsY3p1a206aXNzdWVyIiwiYXVkIjoib3JnOm1pY2hhbGN6dWttOmF1ZGllbmNlIn0.CHaB_qZjIuKMYc487Jscj-KCyj1OuW8-e1R1d1n0KucsF2t_XtXNDzjOk7qowhpVLwF_GBzgUvPYoCi3BUmSyQ"


Running 40s test @ http://localhost:3012/api/posts
100 connections with 10 pipelining factor


┌─────────┬────────┬────────┬────────┬────────┬──────────┬───────────┬─────────┐
│ Stat    │ 2.5%   │ 50%    │ 97.5%  │ 99%    │ Avg      │ Stdev     │ Max     │
├─────────┼────────┼────────┼────────┼────────┼──────────┼───────────┼─────────┤
│ Latency │ 162 ms │ 341 ms │ 361 ms │ 367 ms │ 348.5 ms │ 350.76 ms │ 8736 ms │
└─────────┴────────┴────────┴────────┴────────┴──────────┴───────────┴─────────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬─────────┬────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev  │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼────────┼─────────┤
│ Req/Sec   │ 1,739   │ 1,739   │ 2,887   │ 3,001   │ 2,855.8 │ 205.04 │ 1,739   │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼────────┼─────────┤
│ Bytes/Sec │ 6.72 MB │ 6.72 MB │ 11.1 MB │ 11.6 MB │ 11 MB   │ 790 kB │ 6.71 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴────────┴─────────┘

Req/Bytes counts sampled once per second.
# of samples: 40

115k requests in 40.05s, 441 MB read
```

## Fastify app

- using raw `fastify` (without `fastify-cli`)

```sh
➜  benchmarks git:(master) ✗ npx autocannon -c 100 -d 40 -p 10 localhost:3013/api/posts -H Authorization="Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJvcmc6bWljaGFsY3p1a206aXNzdWVyIiwiYXVkIjoib3JnOm1pY2hhbGN6dWttOmF1ZGllbmNlIn0.CHaB_qZjIuKMYc487Jscj-KCyj1OuW8-e1R1d1n0KucsF2t_XtXNDzjOk7qowhpVLwF_GBzgUvPYoCi3BUmSyQ"


Running 40s test @ http://localhost:3013/api/posts
100 connections with 10 pipelining factor


┌─────────┬───────┬───────┬───────┬───────┬─────────┬──────────┬─────────┐
│ Stat    │ 2.5%  │ 50%   │ 97.5% │ 99%   │ Avg     │ Stdev    │ Max     │
├─────────┼───────┼───────┼───────┼───────┼─────────┼──────────┼─────────┤
│ Latency │ 21 ms │ 26 ms │ 51 ms │ 57 ms │ 34.5 ms │ 22.53 ms │ 1388 ms │
└─────────┴───────┴───────┴───────┴───────┴─────────┴──────────┴─────────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬──────────┬─────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg      │ Stdev   │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼──────────┼─────────┼─────────┤
│ Req/Sec   │ 24,447  │ 24,447  │ 28,767  │ 29,167  │ 28,567.2 │ 940.42  │ 24,437  │
├───────────┼─────────┼─────────┼─────────┼─────────┼──────────┼─────────┼─────────┤
│ Bytes/Sec │ 82.8 MB │ 82.8 MB │ 97.5 MB │ 98.8 MB │ 96.8 MB  │ 3.18 MB │ 82.8 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴──────────┴─────────┴─────────┘

Req/Bytes counts sampled once per second.
# of samples: 40

1144k requests in 40.02s, 3.87 GB read
```
