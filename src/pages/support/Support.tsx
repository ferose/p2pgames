import * as React from 'react';
import './Support.scss';

interface ISupportProps {}
interface ISupportState {}

export class Support extends React.Component<ISupportProps, ISupportState> {
    public render() {
        return (
            <div className="Support">
                <h1>Support</h1>
                <p>This is a beta site with a lot under construction.</p>
                <p>Feedback can be sent to: ferosegame@gmail.com</p>
            </div>
        )
    }
}
