import React from 'react';
import "./Menu.scss";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faGamepad, faExpand } from '@fortawesome/free-solid-svg-icons'
import { makeConditionalLink } from './ConditionalLink';
import { RootState } from '../RootReducer';
import { connect } from 'react-redux';

interface IMenuProps {
    onHide: () => void;
    show: boolean;
    gameName?: string;
}

const ConditionalItem = makeConditionalLink(ListGroup.Item) as typeof ListGroup.Item;

const MenuClass: React.FC<IMenuProps> = (props) => {
    const rootDiv = document.getElementById("root");
    return (
        <Modal
            onHide={props.onHide}
            show={props.show}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
            Menu
            </Modal.Title>
        </Modal.Header>

        {props.gameName && rootDiv && rootDiv.requestFullscreen &&
            <Modal.Body>
                <ListGroup>
                    <ConditionalItem action onClick={() => rootDiv.requestFullscreen()}>
                        <FontAwesomeIcon className="link-icon" icon={faExpand} fixedWidth/> Fullscreen
                    </ConditionalItem>
                </ListGroup>
            </Modal.Body>
        }

        <Modal.Body>
            <ListGroup>
                <ConditionalItem action href="/" target="_blank">
                    <FontAwesomeIcon className="link-icon" icon={faGamepad} fixedWidth/> More Games
                </ConditionalItem>
                <ConditionalItem action href={"support"} target="_blank">
                    <FontAwesomeIcon className="link-icon" icon={faEnvelope} fixedWidth/> Feedback
                </ConditionalItem>
            </ListGroup>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
        </Modal>
    );
}

export default connect((state:RootState) => {
    return {
        gameName: state.general.gameName,
    }
}, {})(MenuClass);