import * as React from 'react';
import styles from './DataverseTasks.module.scss';
import type { IDataverseTasksProps } from './IDataverseTasksProps';
import { TasksList } from "mgwdev-dataverse-tasks/lib/components/TasksList";

export default class DataverseTasks extends React.Component<IDataverseTasksProps, {}> {
  public render(): React.ReactElement<IDataverseTasksProps> {
 

    return (
      <section className={styles.dataverseTasks}>
        <TasksList />
      </section>
    );
  }
}
