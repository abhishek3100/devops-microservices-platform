from concurrent import futures
import grpc
import notification_pb2_grpc
from src.handlers.notification_handler import NotificationServiceServicer

from grpc_reflection.v1alpha import reflection


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))

    notification_pb2_grpc.add_NotificationServiceServicer_to_server(
        NotificationServiceServicer(), server
    )

    SERVICE_NAMES = (
        "notification.NotificationService",
        reflection.SERVICE_NAME,
    )

    reflection.enable_server_reflection(SERVICE_NAMES, server)

    server.add_insecure_port('[::]:50052')
    print("Notification Service running on port 50052")

    server.start()
    server.wait_for_termination()


if __name__ == "__main__":
    serve()