import notification_pb2
import notification_pb2_grpc

from time import perf_counter

from src.services import notification_service
from src.metrics import (
    grpc_requests_total,
    grpc_request_duration_seconds,
)


class NotificationServiceServicer(
    notification_pb2_grpc.NotificationServiceServicer
):

    def SendNotification(self, request, context):
        start = perf_counter()

        try:
            status = notification_service.send_notification(request.message)

            grpc_requests_total.labels(
                method="SendNotification",
                status="success"
            ).inc()

            return notification_pb2.NotificationResponse(
                status=status
            )

        except Exception:
            grpc_requests_total.labels(
                method="SendNotification",
                status="error"
            ).inc()
            raise

        finally:
            grpc_request_duration_seconds.labels(
                method="SendNotification"
            ).observe(perf_counter() - start)