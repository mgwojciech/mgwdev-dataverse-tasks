import * as React from "react";
import { IDataverseTask } from "../model/IDataverseTask";
import { TasksService } from "../services/TasksService";
import { useDataverse } from "../context/DataverseContext";
import { DataverseUserService } from "../services/DataverseUserService";
import { ActionButton, IconButton, IIconProps, List, makeStyles, Spinner, Text } from "@fluentui/react";
import { TaskForm } from "./TaskForm";

export interface ITasksListProps {

}

const addFriendIcon: IIconProps = { iconName: 'Add' };

const useStyles = makeStyles({
    tasksList: {
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        flexWrap: "wrap"
    }
});
export const TasksList: React.FC<ITasksListProps> = (props) => {
    const [tasks, setTasks] = React.useState<IDataverseTask[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [newTask, setNewTask] = React.useState<IDataverseTask | undefined>(undefined);
    const { dataverseResource, dataverseClient } = useDataverse();
    const service = new TasksService(dataverseClient, dataverseResource!, new DataverseUserService(dataverseClient, dataverseResource!));
    const styles = useStyles();
    React.useEffect(() => {
        service.getMyTasks().then((data) => {
            setTasks(data);
            setLoading(false);
        }).catch((error) => {
            console.error(error);
            setLoading(false);
        });
    }, []);

    return (
        <div>
            <Text as="h2" variant="xLarge">Tasks List</Text>
            <div>
                {loading && <Spinner />}
                {!loading && tasks.length === 0 && <div>No tasks found</div>}
                {!loading && tasks.length > 0 && <div className={styles.tasksList}>{tasks.map((task, index) => <TaskForm
                    key={index}
                    task={task}
                    onComplete={(task) => { service.completeTask(task) }}
                    onSave={(task) => { service.updateTask(task) }}
                />)}
                {newTask && <TaskForm isEditMode={true} task={newTask} onSave={(task) => {
                    service.addTask(task).then(() => {
                        setNewTask(undefined);
                        service.getMyTasks().then((data) => {
                            setTasks(data);
                        });
                    }).catch((error) => {
                        console.error(error);
                    });
                }} />}
                </div>}
            </div>
            <ActionButton iconProps={addFriendIcon} allowDisabledFocus onClick={()=>{
                setNewTask({
                    subject: "",
                    description: "",
                    scheduledstart: new Date().toISOString(),
                    scheduledend: new Date().toISOString(),
                    percentcomplete: 0
                });
            }}>
                Create Task
            </ActionButton>
        </div>
    );
}