import * as React from 'react';
import styles from './GameOver.module.scss';
import Button from 'react-bootstrap/Button';

interface IGameOverProps {
    onRematch(): void;
}
interface IGameOverState {}

export class GameOver extends React.Component<IGameOverProps, IGameOverState> {
    public render() {
        return (
            <div className={styles.container}>
                <Button onClick={this.props.onRematch}>Rematch</Button>
            </div>
        )
    }
}
