import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

interface IMenuProps {
    onHide: () => void;
    show: boolean;
}

const Menu: React.FC<IMenuProps> = (props) => {
    return (
        <Modal
            {...props}
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
            <ListGroup defaultActiveKey="#link1">
                <ListGroup.Item action onClick={()=>{alert("Under construction")}}>
                    More Games
                </ListGroup.Item>
                <ListGroup.Item action onClick={()=>{alert("Under construction")}}>
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
