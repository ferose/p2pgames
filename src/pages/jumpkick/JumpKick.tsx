import * as React from 'react';
import styles from './JumpKick.module.scss';

interface IJumpKickProps {}
interface IJumpKickState {}

export class JumpKick extends React.Component<IJumpKickProps, IJumpKickState> {
    public render() {
        return (
            <div className={styles.container}></div>
        )
    }
}
