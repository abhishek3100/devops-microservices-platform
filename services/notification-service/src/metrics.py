from prometheus_client import Counter, Histogram, start_http_server

grpc_requests_total = Counter(
    "grpc_requests_total",
    "Total number of gRPC requests",
    ["method", "status"],
)

grpc_request_duration_seconds = Histogram(
    "grpc_request_duration_seconds",
    "Duration of gRPC requests",
    ["method"],
)


def start_metrics_server():
    start_http_server(8000)