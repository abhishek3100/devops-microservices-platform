import time
from functools import wraps

from src.metrics import (
    grpc_requests_total,
    grpc_request_duration_seconds,
)


def track_grpc_metrics(method_name):
    def decorator(func):
        @wraps(func)
        def wrapper(self, request, context):
            start = time.time()

            status = "OK"

            try:
                return func(self, request, context)

            except Exception:
                status = "ERROR"
                raise

            finally:
                grpc_requests_total.labels(
                    method=method_name,
                    status=status
                ).inc()

                grpc_request_duration_seconds.labels(
                    method=method_name
                ).observe(time.time() - start)

        return wrapper

    return decorator