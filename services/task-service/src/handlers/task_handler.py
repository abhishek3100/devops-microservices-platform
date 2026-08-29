import grpc
from time import perf_counter

import task_pb2
import task_pb2_grpc

from src.services import task_service
from src.services import notification_client

from src.metrics_wrapper import track_grpc_metrics

from src.metrics import (
    grpc_requests_total,
    grpc_request_duration_seconds,
)


class TaskServiceServicer(task_pb2_grpc.TaskServiceServicer):
    @track_grpc_metrics("CreateTask")

    def CreateTask(self, request, context):
        start = perf_counter()
        

        try:
            task = task_service.create_task(request.title)

            notification_client.send_notification(
                f"New task created: {task['title']}"
            )

            grpc_requests_total.labels(
                method="CreateTask",
                status="success"
            ).inc()

            return task_pb2.CreateTaskResponse(
                task=task_pb2.Task(
                    id=task["id"],
                    title=task["title"],
                    status=task["status"]
                )
            )

        except Exception:
            grpc_requests_total.labels(
                method="CreateTask",
                status="error"
            ).inc()
            raise

        finally:
            grpc_request_duration_seconds.labels(
                method="CreateTask"
            ).observe(perf_counter() - start)
    @track_grpc_metrics("GetTasks")
    def GetTasks(self, request, context):
        start = perf_counter()

        try:
            tasks = task_service.get_tasks()

            grpc_requests_total.labels(
                method="GetTasks",
                status="success"
            ).inc()

            return task_pb2.GetTasksResponse(
                tasks=[
                    task_pb2.Task(
                        id=t["id"],
                        title=t["title"],
                        status=t["status"]
                    )
                    for t in tasks
                ]
            )

        except Exception:
            grpc_requests_total.labels(
                method="GetTasks",
                status="error"
            ).inc()
            raise

        finally:
            grpc_request_duration_seconds.labels(
                method="GetTasks"
            ).observe(perf_counter() - start)