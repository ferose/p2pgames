import * as React from 'react';
import './Skeleton.scss';

interface ISkeletonProps {}
interface ISkeletonState {}

export default class Skeleton extends React.Component<ISkeletonProps, ISkeletonState> {
    public render() {
        return (
            <div className="Skeleton"></div>
        )
    }
}
