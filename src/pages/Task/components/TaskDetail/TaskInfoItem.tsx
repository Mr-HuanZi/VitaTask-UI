import React, {FC} from "react";
import styles from "@/pages/Task/components/TaskDetail/index.less";

const TaskInfoItem: FC<{label: React.ReactNode}> = ({label, children}) => {
  return (
    <div className={styles.describeItemContainer}>
      <span className={styles.describeItemLabel}>{label}</span>
      <span className={styles.describeItemContent}>{children}</span>
    </div>
  );
}

export default TaskInfoItem;
