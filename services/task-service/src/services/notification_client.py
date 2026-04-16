import grpc
import notification_pb2, notification_pb2_grpc


channel = grpc.insecure_channel("notification-service:50052")

client = notification_pb2_grpc.NotificationServiceStub(channel)


def send_notification(message):
    request = notification_pb2.NotificationRequest(message=message)
    response = client.SendNotification(request)

    return response.status