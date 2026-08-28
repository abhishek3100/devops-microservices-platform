from concurrent import futures
import grpc
import notification_pb2_grpc
from src.handlers.notification_handler import NotificationServiceServicer

from grpc_reflection.v1alpha import reflection
from grpc_health.v1 import health
from grpc_health.v1 import health_pb2
from grpc_health.v1 import health_pb2_grpc


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))

    notification_pb2_grpc.add_NotificationServiceServicer_to_server(
        NotificationServiceServicer(), server
    )

    health_servicer = health.HealthServicer()

    health_pb2_grpc.add_HealthServicer_to_server(
        health_servicer,
        server
    )

    SERVICE_NAMES = (
        "notification.NotificationService",
        reflection.SERVICE_NAME,
    )

    reflection.enable_server_reflection(SERVICE_NAMES, server)

    server.add_insecure_port('[::]:50052')
    print("Notification Service running on port 50052")

    health_servicer.set(
    "",
    health_pb2.HealthCheckResponse.SERVING
    )

    server.start()
    server.wait_for_termination()


if __name__ == "__main__":
    serve()