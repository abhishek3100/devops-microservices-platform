tasks = []
task_id_counter = 1

def create_task(title):
    global task_id_counter

    task = {
        "id": task_id_counter,
        "title": title,
        "status": "PENDING"
    }

    tasks.append(task)
    task_id_counter += 1

    return task


def get_tasks():
    return tasks