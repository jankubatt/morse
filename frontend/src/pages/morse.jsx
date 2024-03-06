import { useNavigate } from 'react-router-dom';
import '../App.css';
import React, { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Stopwatch } from '../components';

const MorsePage = () => {
	const morseCode = {
		'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
		'1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
		'.': '.-.-.-', ',': '--..--', '?': '..--..', '\'': '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
	}

	const [morse, setMorse] = useState('')
	const [solution, setSolution] = useState('')
	const [sentences, setSentences] = useState([])
	const [sentence, setSentence] = useState('')
	const [showModal, setShowModal] = useState(false)
	const [modalCompleted, setModalCompleted] = useState(false)
	const [user, setUser] = useState(null);

	const [stats, setStats] = useState({
		ttc: 0,	//Time to complete
		mistakes: [],	//Mistakes
	});	//Current sentence stats
	const [startTime, setStartTime] = useState(0)	//Start time of current sentence
	const [elapsedTime, setElapsedTime] = useState(0);
	const [isRunning, setIsRunning] = useState(true);

	const navigate = useNavigate();

	const timerId = useRef(null);
	const touchStart = useRef(0);
	const touchStartPosition = useRef({ x: 0, y: 0 });
	const touchEndPosition = useRef({ x: 0, y: 0 });

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

	const fetchUser = async () => {
		const response = await axios.post(`${process.env.REACT_APP_API}/users/`, { token: Cookies.get("token") });
		return response.data;
	};

	const formatTime = (milliseconds) => {
		const totalMilliseconds = Math.floor(milliseconds);
		const minutes = Math.floor(totalMilliseconds / (60 * 1000));
		const seconds = Math.floor((totalMilliseconds % (60 * 1000)) / 1000);
		const millisecondsPart = totalMilliseconds % 1000;

		const pad = (value) => (value < 10 ? `0${value}` : value);

		return `${pad(minutes)}:${pad(seconds)}.${pad(millisecondsPart)}`;
	};

	const handleComplete = () => {
		fetchUser().then((data) => {
			setUser(data);
		}).catch((e) => setUser(null));
		
		setSentence(sentences[Math.floor(Math.random() * sentences.length)].toUpperCase().replace(".", ""))
		setMorse('')
		setModalCompleted(false);
		setStats({
			ttc: 0,
			mistakes: []
		})
		setIsRunning(true);
	}

	useEffect(() => {
		fetchUser().then((data) => {
			setUser(data);
		}).catch((e) => setUser(null));
	}, []);

	useEffect(() => {
		let interval;

		if (isRunning) {
			setStartTime(performance.now() - elapsedTime);
			interval = setInterval(() => {
				setElapsedTime(performance.now() - startTime);
			}, 1);
		} else {
			clearInterval(interval);
		}

		return () => clearInterval(interval);
	}, [isRunning, startTime, elapsedTime]);

	useEffect(() => {
		fetch('/test.json')
			.then(response => response.json())
			.then(json => {
				setSentences(json)
				setSentence(json[Math.floor(Math.random() * json.length)].toUpperCase().replace(".", ""))
				setStartTime(new Date().getTime())
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

	useEffect(() => {
		const morseArray = morse.split('/')
		const solutionArray = morseArray.map((morse) => {
			return Object.keys(morseCode).find(key => morseCode[key] === morse)
		})
		setSolution(solutionArray.join('').replaceAll(";", " "))

		if (morseArray[morseArray.length - 1] === "" && morseArray.length > 1) {
			// console.log(morseArray)
			// console.log(solution, sentence)

			for (let i = 0; i < solution.length; i++) {
				if (solution[i] !== sentence[i] && stats.mistakes.filter(mistake => mistake.index === i).length === 0) {
					setStats(prev => {
						return {
							...prev,
							mistakes: prev.mistakes.concat({ index: i, correct: sentence[i], wrong: solution[i] })
						}
					})
				}
			}
		}

		if (solution === sentence && sentences.length > 0 && elapsedTime > 0 && modalCompleted === false) {
			let ttc = elapsedTime;
			setStats(prev => {
				return {
					...prev,
					ttc
				}
			})
			setStartTime(0)
			setElapsedTime(0)
			setIsRunning(false);
			setModalCompleted(true);

			if (user) {
				axios.post(`${process.env.REACT_APP_API}/users/sentence/done`, {
					id_user: user.id,
					sentence: sentence,
					ttc: ttc,
					mistakes: stats.mistakes.length
				}).then((response) => {
					console.log("saved")
				}).catch((e) => console.error(e));
			}
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
				<p id='score'>
					{formatTime(elapsedTime)}
					
					&nbsp;Sentences written: {user ? user.score : <><button onClick={() => navigate("/register")}>Register</button>/<button onClick={() => navigate("/login")}>Login</button></>}
				</p>
			</div>

			<div className='bottom-buttons' onTouchStart={(e) => e.stopPropagation()} onTouchEnd={(e) => e.stopPropagation()}>
				<button onClick={() => {
					setMorse(prev => prev + "/")
					clearTimeout(timerId.current);
				}}>End Letter</button>

				<button onClick={() => {
					setMorse(prev => prev + "-.-.-./")
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

			<button className='help-button' onClick={() => { setShowModal(true); }}>?</button>

			{showModal && <div className='modal'>
				<div className='modal-content'>
					<div className='modal-close' onClick={() => { setShowModal(false); }}>x</div>

					<div>
						<h2>Instructions</h2>
						<p>For PC users, any other keys then backspace and space insert dash or dot. Space forces to end letter and backspace erases most recent letter.</p>
						<p>The "Space" button inserts -.-.-. which is ";". The semicolon inserts space into the solution.</p>

						<h2>Credit</h2>
						<p>Made by Jan Kubát<br /><a href='https://jankubat-it.cz/'>https://jankubat-it.cz/</a></p>

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

			{modalCompleted && <div className='modal'>
				<div className='modal-content'>
					<div className='modal-close' onClick={handleComplete}>x</div>

					<div>
						<h2>Sentence completed!</h2>
						<p>Time to complete: {formatTime(stats.ttc)}</p>
						<p>Mistakes: {stats.mistakes.length}</p>
					</div>

					<button onClick={handleComplete}>Next</button>
				</div>
			</div>}
		</div>
	);
}

export default MorsePage;