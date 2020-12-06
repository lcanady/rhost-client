import {
  Button,
  Container,
  fade,
  InputBase,
  makeStyles,
  Paper,
} from '@material-ui/core';
import React, { useRef, useState } from 'react';
import NavBar from './components/NavBar';
import Ansi from 'ansi-to-react';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.default,
  },
  mush: {
    display: 'flex',
    flexDirection: 'column',
    margin: '65px auto 0 auto',
    width: '100%',
    height: 'calc(100vh - 65px)',
  },
  input: {
    width: '100%',
    minHeight: '38px',
    background: fade(theme.palette.common.white, 0.15),
    padding: theme.spacing(2),
    margin: '0 auto 0 auto',
  },
  output: {
    overflowAnchor: 'none',
    fontFamily: 'monospace',
    fontSize: '1.2rem',
    margin: 'auto auto 0 auto',
    width: '100%',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    maxHeight: 'calc(100vh - 65px)',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      background: fade(theme.palette.common.black, 0.15),
      width: '10px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: fade(theme.palette.common.black, 0.2),
    },
    '& *': {
      overflowAnchor: 'none',
    },
  },
}));

interface AppProps {}

function App({}: AppProps) {
  const classes = useStyles();
  const [connected, setConnected] = useState(false);
  const [msgs, setMsgs] = useState(() => [] as string[]);
  const outRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<WebSocket>();
  const [input, setInput] = useState('');

  const handleConnect = () => {
    setConnected(true);
    const ws = new WebSocket('ws://digibear.io:4202');
    setSocket(ws);
    ws.onmessage = (e) => {
      setMsgs((v) => [...v, e.data]);
      scrollToBottom();
    };
    ws.onclose = () => setConnected(false);
  };

  const handleInput = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      socket?.send(input);
      setInput('');
    }
  };

  const scrollToBottom = () =>
    anchorRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className={classes.root} id="app">
      <NavBar>
        <Button onClick={handleConnect} disabled={connected}>
          Connect
        </Button>
      </NavBar>
      <Container>
        <Paper className={classes.mush} square>
          <div ref={outRef} className={classes.output} id="scroller">
            {msgs.map((m) => (
              <div
                style={{
                  padding: 0,
                  margin: 0,
                  width: '100%',
                  overflowAnchor: 'none',
                  whiteSpace: 'pre-wrap',
                }}
              >
                <Ansi>{m}</Ansi>
              </div>
            ))}
            <div
              ref={anchorRef}
              style={{ overflowAnchor: 'auto', height: '1px' }}
              id="anchor"
            ></div>
          </div>
          <InputBase
            ref={inputRef}
            className={classes.input}
            multiline
            value={input}
            onKeyPress={(e) => handleInput(e)}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter Something"
          ></InputBase>
        </Paper>
      </Container>
    </div>
  );
}

export default App;
