import * as React from "react";
import { IDataverseTask } from "../model/IDataverseTask";
import { DatePicker, DocumentCard, DocumentCardActivity, DocumentCardStatus, DocumentCardTitle, IconButton, makeStyles, PersonaSize, Slider, TextField } from "@fluentui/react";
import { CompletionIcon } from "./CompletionIcon";
import { TimeZoneService } from "../services/TimeZoneService";
import { GraphPersona } from "./GraphPersona";

export interface ITaskFormProps {
    task?: IDataverseTask;
    onSave?: (task: IDataverseTask) => void;
    onComplete?: (task: IDataverseTask) => void;
    isEditMode?: boolean;
}

const useStyles = makeStyles({
    taskWrapper: {
        display: "flex",
        flexDirection: "column",
        gap: "0.2rem",
        width: "300px",
        padding: "0.5rem",
        border: "1px solid #eaeaea",
        transitionProperty: "all",
        transitionDuration: "0.3s",
        transitionTimingFunction: "ease-in-out",
        "&:hover": {
            boxShadow: "0 0 5px 0 #eaeaea",
            transform: "scale(1.02)"
        }
    },
    taskHeader: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center"
    },
    taskDescription: {

    },
    editButton: {

    }
});

export function TaskForm(props: ITaskFormProps) {
    const [task, setTask] = React.useState<IDataverseTask>(props.task || {
        subject: "",
        description: "",
        scheduledstart: new Date().toISOString(),
        scheduledend: new Date().toISOString(),
        percentcomplete: 0
    });
    const [editMode, setEditMode] = React.useState<boolean>(props.isEditMode || false);
    const styles = useStyles();

    React.useEffect(() => {
        setTask(props.task || {
            subject: "",
            description: "",
            scheduledstart: new Date().toISOString(),
            scheduledend: new Date().toISOString(),
            percentcomplete: 0
        });
    }, [props.task])

    React.useEffect(()=>{
        setEditMode(props.isEditMode || false);
    }, [props.isEditMode]);

    return <div className={styles.taskWrapper}>{editMode ? <TaskEditForm {...props} onSave={(task) => {
        setEditMode(false);
        setTask(task);
        props.onSave && props.onSave(task);
    }} /> : <>
        <div className={styles.taskHeader}>{task?.subject}
            <IconButton iconProps={{
                iconName: "Edit",
                onClick: () => {
                    setEditMode(true);
                }
            }} title="Edit" ariaLabel="Edit" /></div>
        <div className={styles.taskDescription}>{task?.description || ""}</div>
        <div>{task && task.scheduledstart && TimeZoneService.getRelativeTime(new Date(task?.scheduledstart), "en-US")}</div>
        <div>{task && task.scheduledend && TimeZoneService.getRelativeTime(new Date(task?.scheduledend), "en-US")}</div>
        <div>{task && <CompletionIcon percentComplete={task.percentcomplete || 0} />}</div>
        <div>{task &&  <IconButton iconProps={{
                iconName: "Accept",
                onClick: () => {
                    setTask({
                        ...task,
                        percentcomplete: 100
                    })
                    props.onComplete && props.onComplete(task);
                }
            }} title="Complete" ariaLabel="Complete" />}</div>
        {/* <div><GraphPersona size={PersonaSize.size32} /></div> */}
    </>}
    </div >
}

export function TaskEditForm(props: ITaskFormProps & { onCancel?: () => void }) {
    const [task, setTest] = React.useState<IDataverseTask>(props.task || {
        subject: "",
        description: "",
        scheduledstart: new Date().toISOString(),
        scheduledend: new Date().toISOString(),
        percentcomplete: 0
    });
    React.useEffect(() => {
        setTest(props.task || {
            subject: "",
            description: "",
            scheduledstart: new Date().toISOString(),
            scheduledend: new Date().toISOString(),
            percentcomplete: 0
        });
    }, [props.task])
    return <div>
        <TextField label="Subject" value={task.subject} onChange={(e, v) => {
            setTest({
                ...task,
                subject: v || ""
            });
        }} />
        <TextField label="Description" value={task.description} onChange={(e, v) => {
            setTest({
                ...task,
                description: v || ""
            });
        }} />
        <Slider label="Percent Complete" min={0} max={100} value={task.percentcomplete} onChange={(v) => {
            setTest({
                ...task,
                percentcomplete: v
            });
        }} />
        <DatePicker label="Start Date" value={new Date(task.scheduledstart)} onSelectDate={(d) => {
            setTest({
                ...task,
                scheduledstart: d?.toISOString() || ""
            });
        }} />
        <DatePicker label="End Date" value={new Date(task.scheduledend)} onSelectDate={(d) => {
            setTest({
                ...task,
                scheduledend: d?.toISOString() || ""
            });
        }} />
        <IconButton iconProps={{
            iconName: "Save",
            onClick: () => {
                props.onSave && props.onSave(task);
            }
        }} title="Save" ariaLabel="Save" />
        <IconButton iconProps={{
            iconName: "Cancel",
            onClick: () => {
                props.onSave && props.onSave(task);
            }
        }} title="Cancel" ariaLabel="Cancel" />
    </div>
}