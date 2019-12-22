import * as React from 'react';
import styles from './Homepage.module.scss';
import { GamePreview } from './GamePreview';

interface IHomepageProps {}
interface IHomepageState {}

export class Homepage extends React.Component<IHomepageProps, IHomepageState> {
    public render() {
        return (
            <div className={styles.container}>
                <GamePreview
                    description="Play against a friend and be the first to connect 4 in a line."
                    imageName="/img/connect4.png"
                    title="4 Play"
                    link="4play"/>
                <GamePreview
                    description="More games under way. Suggestions are appreciated."
                    imageName="/img/icon.svg"
                    title="More Coming"
                    buttonText="Feedback"
                    link="support"/>
            </div>
        )
    }
}
