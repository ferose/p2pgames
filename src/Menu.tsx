import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

interface IMenuProps {
    onHide: () => void;
    requestfullscreen: () => void;
    show: boolean;
}

function sendSupportEmail() {
    window.open("mailto:ferosegame@gmail.com");
}

function fullscreenClicked(props: IMenuProps) {
    props.onHide();
    props.requestfullscreen();
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
                <ListGroup.Item action onClick={() => fullscreenClicked(props)}>
                    Fullscreen
                </ListGroup.Item>
            </ListGroup>
        </Modal.Body>
        <Modal.Body>
            <ListGroup>
                <ListGroup.Item action onClick={()=>{alert("Under construction")}}>
                    More Games
                </ListGroup.Item>
                <ListGroup.Item action onClick={sendSupportEmail}>
                    Feedback
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
