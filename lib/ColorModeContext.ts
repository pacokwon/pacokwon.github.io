import React from 'react';

type Props = {
  toggleColorMode: () => void;
};

// eslint-disable-next-line
const ColorModeContext = React.createContext<Props>({
  toggleColorMode: () => {},
});

export default ColorModeContext;
