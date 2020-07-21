import React from "react";

const ctx = React.createContext();

export const { Provider, Consumer } = ctx;

export const withContext = Component => {
  return props => {
    return (
      <Consumer>
        {
          globalState => {
            return (
              <Component
                {...globalState}
                {...props}
              />
            )
          }
        }
      </Consumer>
    )
  }
}

export default ctx;