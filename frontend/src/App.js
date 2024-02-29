import './App.css';
import React from 'react';

function App() {
	const morseCode = {
		'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
		'1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
		'.': '.-.-.-', ',': '--..--', '?': '..--..', '\'': '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
	}

	const [morse, setMorse] = React.useState('')
	const [solution, setSolution] = React.useState('')
	const [sentences, setSentences] = React.useState([])
	const [sentence, setSentence] = React.useState('')
	const [showModal, setShowModal] = React.useState(false)

	const timerId = React.useRef(null);
	const touchStart = React.useRef(0);
	const touchStartPosition = React.useRef({ x: 0, y: 0 });
	const touchEndPosition = React.useRef({ x: 0, y: 0 });

	const handleTouchStart = (e) => {
		touchStart.current = performance.now();
		touchStartPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
	};

	const handleTouchEnd = (e) => {
		touchEndPosition.current = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };

		const touchEnd = performance.now();
		const duration = touchEnd - touchStart.current;

		if (duration < 250) {
			setMorse(prev => prev + '.')
			clearTimeout(timerId.current);
		} else if (duration >= 250 && duration < 2000) {
			setMorse(prev => prev + '-')
			clearTimeout(timerId.current);
		}

		touchStart.current = 0;
		timerId.current = setTimeout(() => {
			setMorse(prev => prev + '/')
			clearTimeout(timerId.current);
		}, 2000);
	};

	React.useEffect(() => {
		fetch('/sentences.json')
			.then(response => response.json())
			.then(json => {
				setSentences(json)
				setSentence(json[Math.floor(Math.random() * json.length)].toUpperCase().replace(".", ""))
			})
			.catch(error => console.error('Error:', error));


		let keyDownTime = 0;


		const handleKeyPress = (e) => {
			if (e.code !== 'Backspace' && e.code !== 'Space' && keyDownTime === 0) {
				keyDownTime = performance.now();
				clearTimeout(timerId.current);
				timerId.current = setTimeout(() => {


					setMorse(prev => prev + '/')
					clearTimeout(timerId.current);
				}, 2000);
			}
		};

		const handleKeyUp = (e) => {
			if (e.code !== 'Backspace' && e.code !== 'Space') {

				const keyUpTime = performance.now();
				const duration = keyUpTime - keyDownTime;

				if (duration < 250) {
					setMorse(prev => prev + '.')
				} else if (duration >= 250 && duration < 2000) {
					setMorse(prev => prev + '-')
				}

				keyDownTime = 0;
			}

			if (e.code === 'Backspace' && keyDownTime === 0) {
				setMorse(prev => {
					let parts = prev.split('/');
					parts.pop();
					parts.pop();

					return `${parts.join('/')}/`;
				})
			}

			if (e.code === 'Space' && keyDownTime === 0) {
				setMorse(prev => prev + "/")
				clearTimeout(timerId.current);
			}
		};

		window.addEventListener('keypress', handleKeyPress);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keypress', handleKeyPress);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

	React.useEffect(() => {
		const morseArray = morse.split('/')
		const solutionArray = morseArray.map((morse) => {
			return Object.keys(morseCode).find(key => morseCode[key] === morse)
		})
		setSolution(solutionArray.join('').replaceAll(";", " "))

		if (solution === sentence && sentences.length > 0) {
			setSentence(sentences[Math.floor(Math.random() * sentences.length)].toUpperCase().replace(".", ""))
			setMorse('')
		}
	}, [morse]);

	return (
		<div className="App" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
			<div className='content'>
				<p id='sentence'>{sentence}</p>
				<p id='morse'>{morse}</p>
				<p id='solution'>
					{solution.split('').map((char, index) => {
						let color = sentence[index] === char ? 'green' : 'red';
						return <span style={{ color: color }}>{char}</span>
					})}
				</p>
			</div>

			<div className='bottom-buttons'>
				<button onClick={() => {
					setMorse(prev => prev + "/")
					clearTimeout(timerId.current);
				}}>End Letter</button>

				<button onClick={() => {
					setMorse(prev => prev.slice(0, -1) + "-.-.-./")
					clearTimeout(timerId.current);
				}}>Space</button>

				<button onClick={() => {
					setMorse(prev => {
						let parts = prev.split('/');
						parts.pop();
						parts.pop();

						return `${parts.join('/')}/`;
					})
				}}>Backspace</button>
			</div>

			<button className='help-button' onClick={() => { setShowModal(true); setMorse(prev => prev.slice(0, -1)); clearTimeout(timerId.current); }}>?</button>

			{showModal && <div className='modal'>
				<div className='modal-content'>
					<div className='modal-close' onClick={() => { setShowModal(false); setMorse(prev => prev.slice(0, -1)); clearTimeout(timerId.current); }}>x</div>

					<div>
						<h2>Instructions</h2>
						<p>For PC users, any other keys then backspace and space insert dash or dot. Space forces to end letter and backspace erases most recent letter.</p>
						<p>The "Space" button inserts -.-.-. which is ";". The semicolon inserts space into the solution.</p>
						
						<h2>Credit</h2>
						<p>Made by Jan Kubát<br/><a href='https://jankubat-it.cz/'>https://jankubat-it.cz/</a></p>

						<h2>Morse Code</h2>
						<table>
							<tbody>
								{Object.keys(morseCode).map((key) => {
									return <tr>
										<td>{key}</td>
										<td>{morseCode[key]}</td>
									</tr>
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>}
		</div>
	);
}

export default App;