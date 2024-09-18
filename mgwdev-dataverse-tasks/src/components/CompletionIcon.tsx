import { makeStyles } from "@fluentui/react";
import * as React from "react";

export interface ICompletionIconProps {
    percentComplete: number;
}

const useStyles = makeStyles({
    root: {

    },
    wrapper: {
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        border: "4px solid #eaeaea",
        position: "relative",
        transitionProperty: "all",
        transitionDuration: "0.3s",
        transitionTimingFunction: "ease-in-out",
        "&:hover": {
        }
    },
    circle: {
        position: "absolute",
        top: "-3px",
        left: "-3px",
        display: "block",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        border: "3px solid",
    }
})
export const CompletionIcon: React.FC<ICompletionIconProps> = (props) => {
    const classNames = useStyles();
    return <div className={classNames.root}>
        <div className={classNames.wrapper}>
            <div className={classNames.circle} style={{
                borderColor: `rgba(${255 - props.percentComplete * 2.55}, ${props.percentComplete * 2.55}, 0, 1)`,
                clipPath: `inset(0 ${100 - props.percentComplete}% 0 0)`
            }}>

            </div>
        </div>
    </div>
}