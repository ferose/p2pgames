import React from 'react';
import "./Menu.scss";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faGamepad } from '@fortawesome/free-solid-svg-icons'

interface IMenuProps {
    onHide: () => void;
    show: boolean;
}

function sendSupportEmail() {
    window.open("mailto:ferosegame@gmail.com");
}

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
                <ListGroup.Item action onClick={()=>{alert("Under construction")}}>
                    <FontAwesomeIcon className="link-icon" icon={faGamepad} fixedWidth/> More Games
                </ListGroup.Item>
                <ListGroup.Item action onClick={sendSupportEmail}>
                    <FontAwesomeIcon className="link-icon" icon={faEnvelope} fixedWidth/> Feedback
                </ListGroup.Item>
            </ListGroup>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
        </Modal>
    );
}

export default Menu;
