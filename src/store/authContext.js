import { useState, useEffect, useCallback, createContext } from 'react'

let logoutTimer
// with this empty variable, we are able to redeclare later in other nested/later lines of code so that they can be reused/redefined for otehr uses.

const AuthContext = createContext({
  token: '',
  login: () => {},
  logout: () => {},
  userId: null
})
// 1*

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
// 2*


export const AuthContextProvider = (props) => {
  const localData = getLocalData()
  
  let initialToken
  let initialId
  if (localData) {
    initialToken = localData.token
    initialId = localData.userId
  }
  // 3*

  const [token, setToken] = useState(initialToken)
  const [userId, setUserId] = useState(initialId)
  // 4*


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
  // 5*

  const login = (token, exp, userId) => {
    setToken(token)
    setUserId(userId)
    localStorage.setItem('token', token)
    localStorage.setItem('exp', exp)
    localStorage.setItem('userId', userId)

    const remainingTime = calculateRemainingTime(exp)

    logoutTimer = setTimeout(logout, remainingTime)
  }
  // 6*


  // The logic above is built out so that the values listed below have function and these are what are accessible through props to other files
  // This gives our custom hook creation logic and meaning behind them.
  const contextValue = {
    token,
    login,
    logout, 
    userId
  }
  // 7*

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContext

// if it's a export default, it's exporting the entire component.
// If it's exporting a smaller part of it like in the export const above, then it's pulled by destructing it in other files


// The story behind this code is starting from the top: 
// 1* = This syntax allows create a custome hook which will be used across the project. The logic behind that hook is built below
// 2* = Here with the getLocalData function, it first will remove any instance of data in the localStorage so that any front functionality (the navbar) will work correctly.
      // After it clears any local stroage it then creates a token, exp, and userId (which will be empty) to be stored in a variable to later usage. It also will create a timer for when those localStroage items will be be removed.
// 3* = Once we've build some behind the scene functionality for the localStorage parts, we further it by creating empty variables to be used later on.
// 3*/4* = We then set an instance of those varibales to the localStorage function we created earlier to be the initial values. After we create an inital useState value
// 5* = In the logout function, we are setting the state values back to null once a user logouts. Then we remove the token, exp, and userId from the localStorage along with clearing the timer that started with the login function
// 6* = Just like in the logout function, it just doing the opposite with setting a localStorage instance to the useState instance along with starting the timer for those localStorage instances.
// 7* = Once all the logic is built, we export that by putting into the contextValue which is used to pass into the AuthContext.Provider hook via props (which takes one prop called value)