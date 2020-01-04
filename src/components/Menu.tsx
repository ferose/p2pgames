import React from 'react';
import "./Menu.scss";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faGamepad } from '@fortawesome/free-solid-svg-icons'
import { makeConditionalLink } from './ConditionalLink';

interface IMenuProps {
    onHide: () => void;
    show: boolean;
}

const ConditionalItem = makeConditionalLink(ListGroup.Item) as typeof ListGroup.Item;

const Menu: React.FC<IMenuProps> = (props) => {
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

export default Menu;
