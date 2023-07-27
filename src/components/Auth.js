import {useState, useContext} from 'react'
import axios from 'axios'
import AuthContext from '../store/authContext'

const Auth = () => {

    const authCtx = useContext(AuthContext)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [register, setRegister] = useState(true)

    const submitHandler = e => {
        e.preventDefault()

        const body = {
            username,
            password
        }

        const baseURL = 'http://localhost:8760'

        axios
            .post(register ? `${baseURL}/register` : `${baseURL}/login`, body)
            // destructing the data part below is just save not writing res.data everytime. It still works the same as res.data in the () after .then
            .then(({data}) => {
                console.log('After Auth', data)
                authCtx.login(data.token, data.exp, data.userId)
            })
            .catch(err => {
                setUsername('')
                setPassword('')

            })
            // Putting the setUsername and setPassword in the .catch will clear out the form if something is incorrectly inputted.
            // But putting it in the .then part will keep the values there even if an error occurs. Though a good pratice will be after submission, it will redirect the user somewhere else. 

        console.log('submitHandler called')
    }

    return (
        <main>
            <h1>Welcome!</h1>
            <form className='form auth-form' onSubmit={submitHandler}>
                <input className='form-input' type='text' placeholder='Username' value={username} onChange={e => setUsername(e.target.value)}/>
                <input className='form-input' type='pasword' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
                <button className='form-btn'  >
                    {register ? 'Sign Up' : 'Login'}
                </button>
            </form>
            <button className='form-btn' onClick={() => setRegister(!register)}>Need to {register ? 'Login' : 'Sign Up'}?</button>
        </main>
    )
}

export default Auth