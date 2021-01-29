import React from 'react'
import {
  Switch,
  Route
} from 'react-router-dom'
import './App.css';
import './room.css'
import Room from './components/Room'
import { Home, Forum } from './pages'

function App() {
  return(
    <Switch>
      <Route exact path="/">
        <Home/>
      </Route>
      <Route path="/room/:id">
        <Room/>
      </Route>
      <Route path="/posts/:id">
        <Forum />
      </Route>
    </Switch>
  )
}

export default App;
