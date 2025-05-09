import React, { createContext, useState } from 'react'

export const UserDataContext = createContext()


const UserContext = ({ children }) => {

    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : { email: "", name: "" };
      });

    return (
        <div>
            <UserDataContext.Provider value={{user, setUser}}>
                {children}
            </UserDataContext.Provider>
        </div>
    )
}

export default UserContext