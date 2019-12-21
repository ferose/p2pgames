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
                    description="Compete against a friend and be the first to match 4 in a line."
                    imageName="/img/fourplay.png"
                    title="Four Play"
                    link="4play"/>
                <GamePreview
                    description="More games under way. Suggestions are appreciated."
                    imageName="/logo512.png"
                    title="More Coming"
                    buttonText="Feedback"
                    link="support"/>
            </div>
        )
    }
}
