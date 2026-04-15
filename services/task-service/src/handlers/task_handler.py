import grpc
import task_pb2, task_pb2_grpc
from src.services import task_service


class TaskServiceServicer(task_pb2_grpc.TaskServiceServicer):

    def CreateTask(self, request, context):
        task = task_service.create_task(request.title)

        return task_pb2.CreateTaskResponse(
            task=task_pb2.Task(
                id=task["id"],
                title=task["title"],
                status=task["status"]
            )
        )

    def GetTasks(self, request, context):
        tasks = task_service.get_tasks()

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