import notification_pb2
import notification_pb2_grpc

from src.services import notification_service
from src.metrics import GRPC_REQUEST_COUNT


class NotificationServiceServicer(
    notification_pb2_grpc.NotificationServiceServicer
):

    @GRPC_REQUEST_COUNT.labels(method="SendNotification").count_exceptions()
    def SendNotification(self, request, context):
        status = notification_service.send_notification(request.message)

        return notification_pb2.NotificationResponse(
            status=status
        )