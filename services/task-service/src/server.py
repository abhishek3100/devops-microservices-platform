from concurrent import futures
import grpc

import task_pb2_grpc
from src.handlers.task_handler import TaskServiceServicer
from grpc_reflection.v1alpha import reflection
from grpc_health.v1 import health
from grpc_health.v1 import health_pb2
from grpc_health.v1 import health_pb2_grpc
from src.metrics import start_metrics_server


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))

    task_pb2_grpc.add_TaskServiceServicer_to_server(
        TaskServiceServicer(), server
    )

    health_servicer = health.HealthServicer()

    health_pb2_grpc.add_HealthServicer_to_server(
        health_servicer,
        server
    )

    SERVICE_NAMES = (
    "task.TaskService",
    reflection.SERVICE_NAME,
)

    reflection.enable_server_reflection(SERVICE_NAMES, server)

    server.add_insecure_port('[::]:50051')
    print("Task Service running on port 50051")

    health_servicer.set(
    "",
    health_pb2.HealthCheckResponse.SERVING
    )

    server.start()
    start_metrics_server()
    server.wait_for_termination()


if __name__ == "__main__":
    serve()