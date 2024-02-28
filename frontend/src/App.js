import logo from './logo.svg';
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

	React.useEffect(() => {
		fetch('/sentences.json')
		.then(response => response.json())
		.then(json => {
			setSentences(json)
			setSentence(json[Math.floor(Math.random() * json.length)].toUpperCase().replace(".", ""))
		})
		.catch(error => console.error('Error:', error));


		let keyDownTime = 0;
		let timerId = null;

		const handleKeyPress = (e) => {
			if (e.code !== 'Backspace' && e.code !== 'Space' && keyDownTime === 0) {
				keyDownTime = performance.now();
				clearTimeout(timerId);
				timerId = setTimeout(() => {
					

					setMorse(prev => prev + '/')
					clearTimeout(timerId);
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
				clearTimeout(timerId);
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
	}, [morse]);

	return (
		<div className="App">
			<p id='sentence'>{sentence}</p>
			<p id='morse'>{morse}</p>
			<p id='solution'>{solution}</p>
		</div>
	);
}

export default App;