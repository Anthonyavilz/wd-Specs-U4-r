import { useState, useEffect, useCallback, createContext } from 'react'

let logoutTimer
// with this empty variable, we are able to redeclare later in other nested/later lines of code so that they can be reused/redefined for otehr uses.

const AuthContext = createContext({
  token: '',
  login: () => {},
  logout: () => {},
  userId: null
})

const calculateRemainingTime = (exp) => {
  const currentTime = new Date().getTime()
  const expTime = exp 
  const remainingTime = expTime - currentTime
  return remainingTime
}

const getLocalData = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('exp')
  localStorage.removeItem('userId')
  // By adding these, it allows anything in local storage to be completely clear (which helps fix the navbar loading with the other links rather than the regular two before Auth)

  const storedToken = localStorage.getItem('token')
  const storedExp = localStorage.getItem('exp')
  const storedUserId = localStorage.getItem('userId')
  const remainingTime = calculateRemainingTime(storedExp)

  if (remainingTime <= 1000 * 60 * 30) {
    localStorage.removeItem('token')
    localStorage.removeItem('exp')
    localStorage.removeItem('userId')
    return null
  }


  return {
    token: storedToken,
    duration: remainingTime,
    userId: +storedUserId
  }
}



export const AuthContextProvider = (props) => {
  const localData = getLocalData()
  
  let initialToken
  let initialId
  if (localData) {
    initialToken = localData.token
    initialId = localData.userId
  }

  const [token, setToken] = useState(initialToken)
  const [userId, setUserId] = useState(initialId)


  const logout = (token, exp, userId) => {
    setToken(null)
    setUserId(null)
    localStorage.removeItem(token)
    localStorage.removeItem(exp)
    localStorage.removeItem(userId)

    if(logoutTimer) {
      clearTimeout(logoutTimer)
    }
  }

  const login = (token, exp, userId) => {
    setToken(token)
    setUserId(userId)
    localStorage.setItem('token', token)
    localStorage.setItem('exp', exp)
    localStorage.setItem('userId', userId)

    const remainingTime = calculateRemainingTime(exp)

    logoutTimer = setTimeout(logout, remainingTime)
  }


  // The logic above is built out so that the values listed below have function and these are what are accessible through props to other files
  // This gives our custom hook creation logic and meaning behind them.
  const contextValue = {
    token,
    login,
    logout, 
    userId
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContext

// if it's a export default, it's exporting the entire component.
// If it's exporting a smaller part of it like in the export const above, then it's pulled by destructing it in other files
