import * as React from 'react';
import styles from './Skeleton.module.scss';

interface ISkeletonProps {}
interface ISkeletonState {}

export class Skeleton extends React.Component<ISkeletonProps, ISkeletonState> {
    public render() {
        return (
            <div className={styles.container}></div>
        )
    }
}
