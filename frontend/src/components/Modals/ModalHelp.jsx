
const ModalHelp = ({ setShowModal }) => {
    const handleCloseModal = () => {
        if (setShowModal) {
            setShowModal(false);
        }
    };

    const morseCode = [
        { letter: 'A', code: '.-' },
        { letter: 'B', code: '-...' },
        { letter: 'C', code: '-.-.' },
        { letter: 'D', code: '-..' },
        { letter: 'E', code: '.' },
        { letter: 'F', code: '..-.' },
        { letter: 'G', code: '--.' },
        { letter: 'H', code: '....' },
        { letter: 'I', code: '..' },
        { letter: 'J', code: '.---' },
        { letter: 'K', code: '-.-' },
        { letter: 'L', code: '.-..' },
        { letter: 'M', code: '--' },
        { letter: 'N', code: '-.' },
        { letter: 'O', code: '---' },
        { letter: 'P', code: '.--.' },
        { letter: 'Q', code: '--.-' },
        { letter: 'R', code: '.-.' },
        { letter: 'S', code: '...' },
        { letter: 'T', code: '-' },
        { letter: 'U', code: '..-' },
        { letter: 'V', code: '...-' },
        { letter: 'W', code: '.--' },
        { letter: 'X', code: '-..-' },
        { letter: 'Y', code: '-.--' },
        { letter: 'Z', code: '--..' },
        { letter: ';', code: '-.-.-.' },
    ];

    return (
        <div className='modal'>
            <div className='modal-content'>
                <div className='modal-close' onClick={handleCloseModal}>x</div>

                <div>
                    <h2>Instructions</h2>
                    <p>For PC users, any other keys then backspace and space insert dash or dot. Space forces to end letter and backspace erases most recent letter.</p>
                    <p>The "Space" button inserts -.-.-. which is ";". The semicolon inserts space into the solution.</p>

                    <h2>Credit</h2>
                    <p>Made by Jan Kubát<br /><a href='https://jankubat-it.cz/'>https://jankubat-it.cz/</a></p>

                    <h2>Morse Code</h2>
                    <table>
                        <tbody>
                            {morseCode.map((letter) => {
                                return (
                                    <tr key={letter.letter}>
                                        <td>{letter.letter}</td>
                                        <td>{letter.code}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ModalHelp;