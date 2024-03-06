import { formatTime } from "../../helpers";

const ModalCompleted = ({ stats, handleComplete }) => {
    return (
        <div className='modal'>
            <div className='modal-content'>
                <div className='modal-close' onClick={handleComplete}>x</div>

                <div>
                    <h2>Sentence completed!</h2>
                    <p>Time to complete: {formatTime(stats.ttc)}</p>
                    <p>Mistakes: {stats.mistakes.length}</p>
                </div>

                <button onClick={handleComplete}>Next</button>
            </div>
        </div>
    )
}

export default ModalCompleted;