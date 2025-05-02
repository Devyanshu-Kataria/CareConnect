"use client"

import { createContext, useEffect, useReducer } from "react"

const initialState = {
  user: localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null,
  role: localStorage.getItem("role") || null,
  token: localStorage.getItem("token") || null,
}

export const authContext = createContext(initialState)

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        role: null,
        token: null,
      }

    case "LOGIN_SUCCESS":
      return {
        user: action.payload.user,
        token: action.payload.token,
        role: action.payload.role,
      }

    case "UPDATE_USER":
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      }

    case "LOGOUT":
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      localStorage.removeItem("role")
      return {
        user: null,
        role: null,
        token: null,
      }

    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user))
    }
    if (state.token) {
      localStorage.setItem("token", state.token)
    }
    if (state.role) {
      localStorage.setItem("role", state.role)
    }
  }, [state.user, state.token, state.role])

  return (
    <authContext.Provider
      value={{
        user: state.user,
        token: state.token,
        role: state.role,
        dispatch,
      }}
    >
      {children}
    </authContext.Provider>
  )
}
