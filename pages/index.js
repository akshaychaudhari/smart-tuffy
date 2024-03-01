import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const chatContainerRef = useRef(null);

    useEffect(() => {
        // Check if the chatContainerRef is currently pointing to an element
        if (chatContainerRef.current) {
            const scrollHeight = chatContainerRef.current.scrollHeight;
            const height = chatContainerRef.current.clientHeight;
            const maxScrollTop = scrollHeight - height;
            chatContainerRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
        }
    }, [messages]); // Dependency array includes messages to trigger scroll on update

    const sendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === '') return;

        // Assuming input is a string with messages separated by newlines or another separator.
        // Split the input into multiple messages.
        const userMessages = input.split('\n').filter(message => message.trim() !== '');

        for (const userMessage of userMessages) {
            // Add user message to state
            setMessages(messages => [...messages, { text: userMessage, sender: 'user' }]);

            // Await the response for each message before continuing
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(msgs => [...msgs, { text: data.message, sender: 'bot' }]);
            }

            // Optionally, introduce a small delay between messages
            // await new Promise(resolve => setTimeout(resolve, 500));
        }

        setInput(''); // Clear the input after sending all messages.
    };


    return (

        <div className={styles.container} style={{
            backgroundColor: '#000',
            color: '#0f0',
            backgroundImage: 'url(/neon.jpg)',
            backgroundSize: 'cover', // Cover the entire div
            backgroundPosition: 'center', // Center the background image
            backgroundRepeat: 'no-repeat', // Prevent image repeating
            opacity: '1' // Adjust for desired faded effect 
        }}>
            <Head>
                <title>SmartTuffy ChatBot</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main} style={{ maxWidth: '800px', width: '100%' }}>
                <p style={{ color: '#0f0', textShadow: '0 0 5px #0f0, 0 0 10px #0f0', textAlign: 'center', fontSize: '18px' }}>
                    Discover the future of conversation with SmartTuffy, your AI-powered chat companion.
                </p>
                <h1 className={styles.title} style={{ color: '#0f0', textShadow: '0 0 10px #0f0, 0 0 20px #0f0, 0 0 40px #0f0, 0 0 80px #0f0' }}>
                    Welcome to SmartTuffy!
                </h1>
                <div className="chat-container" ref={chatContainerRef} style={{ position: 'relative', backgroundColor: '#112', padding: '20px', borderRadius: '10px', width: '95%', height: '500px', overflowY: 'auto', maxWidth: '1000px', zIndex: 0 }}>
                    {messages.map((message, index) => (
                        <div key={index} style={{ textAlign: message.sender === 'user' ? 'right' : 'left' }}>
                            <p style={{ backgroundColor: message.sender === 'user' ? '#32CD32' : '#222', color: 'white', display: 'inline-block', padding: '10px', borderRadius: '10px', margin: '5px', boxShadow: '0 0 5px #0f0, 0 0 10px #0f0, 0 0 15px #0f0, 0 0 20px #0070f3' }}>
                                {message.text}
                            </p>
                        </div>
                    ))}
                </div>
                <form onSubmit={sendMessage} style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', marginBottom: '20px', gap: '10px' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '15px',
                                fontSize: '18px',
                                border: '1px solid #0f0',
                                backgroundColor: '#222',
                                color: '#32CD32',
                                marginBottom: '0',
                                animation: 'blinkGlow 2s infinite ease-in-out', // Apply the blinking glow animation
                                outline: 'none'
                            }}
                        />
                        <button type="submit" className="neonButton" style={{
                            fontSize: '18px',
                            padding: '15px 20px',
                            fontWeight: 'bold', // Make text bold
                            backgroundColor: '#32CD32', // Darker shade of green
                            boxShadow: '0 0 5px #32CD32, 0 0 10px #32CD32, 0 0 15px #32CD32, 0 0 20px #32CD32', // Adjust box-shadow to match darker green
                            textShadow: '0 0 5px #32CD32, 0 0 10px #32CD32, 0 0 15px #32CD32, 0 0 20px #32CD32' // Adjust text-shadow to match darker green
                        }}>Send</button>

                    </div>
                </form>
            </main>
            <style jsx global>{`
                body {
                    background-color: #282c34;
                    color: #0f0;
                    font-family: 'Courier New', Courier, monospace;
                }
                ::placeholder {
                    color: #0f0;
                    opacity: 1;
                }
                :-ms-input-placeholder {
                    color: #0f0;
                }
                ::-ms-input-placeholder {
                    color: #0f0;
                }
                .neonButton {
                    min-width: 90px; 
                    background-color: #0070f3;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-shadow: 0 0 5px #0f0, 0 0 10px #0f0, 0 0 15px #0f0, 0 0 20px #0070f3;
                    box-shadow: 0 0 5px #0f0, 0 0 10px #0f0, 0 0 15px #0f0, 0 0 20px #0070f3;
                }
                .neonButton:hover, .neonButton:focus {
                    box-shadow: 0 0 10px #32CD32, 0 0 20px #32CD32, 0 0 30px #32CD32, 0 0 40px #32CD32;
                    text-shadow: 0 0 10px #32CD32, 0 0 20px #32CD32, 0 0 30px #32CD32, 0 0 40px #32CD32;
                }
                .neonButton.red {
                    background-color: red;
                    box-shadow: 0 0 5px #f00, 0 0 10px #f00, 0 0 15px #f00, 0 0 20px #f00;
                }
                .neonButton.red:hover, .neonButton.red:focus {
                    box-shadow: 0 0 10px #f00, 0 0 20px #f00, 0 0 30px #f00, 0 0 40px #f00;
                    text-shadow: 0 0 10px #f00, 0 0 20px #f00, 0 0 30px #f00, 0 0 40px #f00;
                }
                @keyframes blinkGlow {
                    0%, 100% {
                      box-shadow: 0 0 5px #0f0, 0 0 10px #0f0, 0 0 15px #0f0, 0 0 20px #0070f3;
                    }
                    50% {
                      box-shadow: none;
                    }
                }
            `}</style>
        </div>
    );
}