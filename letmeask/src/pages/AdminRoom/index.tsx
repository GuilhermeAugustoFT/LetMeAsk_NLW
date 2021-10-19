import { useParams, useHistory } from 'react-router-dom';

import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg';

import { Button } from '../../components/Button';
import { Question } from '../../components/Question/index';
import { RoomCode } from '../../components/RoomCode/index';
import { useRoom } from '../../hooks/useRoom';

import './styles.scss';
import { database } from '../../services/firebase';

type RoomParams = {
    id: string;
}

export function AdminRoom () {
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { title, questions } = useRoom(roomId);

    async function handleDeleteQuestion(questionId: string) {
        if(window.confirm('Tem certeza que você deseja excluir esta pergunta?'))
        {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleEndRoom() {
        database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        });

        history.push('/');
    }

    return (    
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId}/>
                        <Button isOutlined={true} onClick={() => handleEndRoom()}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>{title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>
                
                <div className="question-list">
                    {questions.map(question => {
                        return (
                        <Question key={question.id} content={question.content} author={question.author}>
                            <button type="button" onClick={() => handleDeleteQuestion(question.id)}>
                                <img src={deleteImg} alt="Remover pergunta" />
                            </button>
                        </Question>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}