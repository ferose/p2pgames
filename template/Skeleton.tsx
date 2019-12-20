import * as React from 'react';
import './Skeleton.scss';

interface ISkeletonProps {}
interface ISkeletonState {}

export class Skeleton extends React.Component<ISkeletonProps, ISkeletonState> {
    public render() {
        return (
            <div className="Skeleton"></div>
        )
    }
}
