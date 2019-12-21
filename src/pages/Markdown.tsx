import * as React from 'react';
import styles from './Markdown.module.scss';
import ReactMarkdown from 'react-markdown';

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

    componentDidMount() {
        const readmePath = require(`./markdown/${this.props.name}.md`);

        fetch(readmePath)
          .then(response => {
            return response.text()
          })
          .then(text => {
            this.setState({
              markdown: text
            })
          })
      }

    public render() {
        return (
            <div className={styles.container}>
                <ReactMarkdown source={this.state.markdown} />
            </div>
        )
    }
}
