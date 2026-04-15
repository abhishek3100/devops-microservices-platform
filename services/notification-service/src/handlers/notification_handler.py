import notification_pb2, notification_pb2_grpc
from src.services import notification_service


class NotificationServiceServicer(
    notification_pb2_grpc.NotificationServiceServicer
):

    def SendNotification(self, request, context):
        status = notification_service.send_notification(request.message)

        return notification_pb2.NotificationResponse(status=status)