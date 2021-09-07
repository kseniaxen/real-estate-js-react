import React from 'react'
import {Modal} from "react-bootstrap";
import {Button} from "react-bootstrap";
import Confetti from 'react-confetti'

export default function ModalSignUp(props) {
    return (
        <div>
            <Modal
                {...props}
                size="xs"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Confetti width={500} height={300} numberOfPieces={50}/>
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Приветствуем!
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Добро пожаловать на сайт Real Estate! Вы успешно зарегистрированны,
                        осталось только войти и создавайте свои объявления:)
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Закрыть</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}