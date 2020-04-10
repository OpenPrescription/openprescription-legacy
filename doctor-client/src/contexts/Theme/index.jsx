import React, { createContext } from "react";
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        text: {
            // primary:  '#02BDC4',
            
        },
      primary: {
        main: '#02BDC4',
        contrastText: '#FFF'
      },
    },

    typography: {
        body1:{
            color: '#444'
            
        },
        subtitle1:{
            color: '#00767A',
            fontWeight: 'bold',
            fontSize: '20px',
            lineHeight: '23px',
        },
        h4:{
            color: 'lime'
        }
      }
  });




  export { theme };