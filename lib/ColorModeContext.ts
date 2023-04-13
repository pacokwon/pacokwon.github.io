import React from 'react';

type Props = {
  toggleColorMode: () => void;
};

const ColorModeContext = React.createContext<Props>({
  // eslint-disable-next-line
  toggleColorMode: () => {},
});

export default ColorModeContext;
