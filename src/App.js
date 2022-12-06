import "xp.css/dist/XP.css";

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import './App.css'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useState, useRef } from "react";

firebase.initializeApp({
  apiKey: "AIzaSyAafY1IMe7QgvdKF2c46ptF5V9tqGcocKk",
  authDomain: "chat-xp-34e6c.firebaseapp.com",
  projectId: "chat-xp-34e6c",
  storageBucket: "chat-xp-34e6c.appspot.com",
  messagingSenderId: "787759137680",
  appId: "1:787759137680:web:7a2ad17f1fbdd90d022915",
  measurementId: "G-B6MN7FJ37E"
})

const auth = firebase.auth();
console.log(auth)
const firestore = firebase.firestore()

let audio = new Audio(require('./assets/whatsapp-sending-message-sound-effect.mp3'))

const start = () => {
  audio.play()
}

function App() {
  const [user] = useAuthState(auth);


  return (
    <div className="superdiv">
      <section>
        <div className="window">
          <div className="title-bar">
            <div className="title-bar-text">XP CHAT</div>
            <div className="title-bar-controls">
              <button aria-label="Minimize"></button>
              <button aria-label="Maximize"></button>
              <button aria-label="Close"></button>
              <SignOut />
            </div>
          </div>
          <div className="window-body">
            {user ? <ChatRoom /> : <SignIn />}
          </div>
        </div>
      </section>
    </div>
  );
}


/* INICIAR SESION */

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <div>
      <button onClick={signInWithGoogle}>Iniciar sesion con Google.</button>
    </div>
  )
}

/* CERRAR SESION */

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()} >Cerrar sesion.</button>
  )
}


/* CHATROOM */

function ChatRoom() {
  const dummy = useRef()

  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limitToLast(12);

  const [messages] = useCollectionData(query, { idField: 'id' })

  const [formValue, setFormValue] = useState('')

  /* funcion enviar mensaje */
  const sendMessage = async (e) => {
    e.preventDefault()

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('')
    dummy.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage} className='send-div'>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit" disabled={!formValue} onClick={start}>Enviar</button>
      </form>
    </>
  )
}

/* MENSAJE */
function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recived';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt='fotogoogle' />
      <p>{text}</p>
    </div>
  </>)
}

export default App;
