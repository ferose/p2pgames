import * as React from 'react';
import './NotFound.scss';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

interface INotFoundProps {}
interface INotFoundState {}

export class NotFound extends React.Component<INotFoundProps, INotFoundState> {
    public render() {
        return (
            <div className="NotFound">
                <h1>404</h1>
                <h4>Page not found</h4>
                <div className="links">
                    <Link to="/"><Button>Homepage</Button></Link>
                    <Link to="/"><Button>Support</Button></Link>
                </div>
            </div>
        )
    }
}
