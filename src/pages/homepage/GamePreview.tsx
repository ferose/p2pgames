import * as React from 'react';
import styles from './GamePreview.module.scss';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

interface IGamePreviewProps {
    imageName: string,
    description: string,
    title: string;
    link: string;
    buttonText?: string;
}
interface IGamePreviewState {}

export class GamePreview extends React.Component<IGamePreviewProps, IGamePreviewState> {
    public render() {
        return (
            <Card className={styles.container}>
                <Card.Img variant="top" src={this.props.imageName} alt={this.props.title}/>
                <Card.Body>
                    <Card.Title>{this.props.title}</Card.Title>
                    <Card.Text>
                    {this.props.description}
                    </Card.Text>
                    <Button variant="primary" href={this.props.link}>{this.props.buttonText || "Play"}</Button>
                </Card.Body>
            </Card>
        )
    }
}
