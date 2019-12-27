import * as React from 'react';
import styles from './Markdown.module.scss';
import ReactMarkdown from 'react-markdown';
import Helmet from 'react-helmet';

interface IMarkdownProps {
    name: string;
}
interface IMarkdownState {
    markdown: string;
}

export class Markdown extends React.Component<IMarkdownProps, IMarkdownState> {
    constructor(props: IMarkdownProps) {
        super(props);
        this.state = {
            markdown: '',
        }
    }

    async componentDidMount() {
        const readmePath = require(`./markdown/${this.props.name}.md`);
        const response = await fetch(readmePath);
        const markdown = await response.text();
        this.setState({
            markdown
        });
    }

    public render() {
        return (
            <div className={styles.container}>
                <Helmet>
                    <title>Peer to Peer Games - {this.props.name}</title>
                </Helmet>
                <ReactMarkdown source={this.state.markdown} />
            </div>
        )
    }
}
