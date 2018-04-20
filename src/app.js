import React, { Component } from 'react';
import logo from './logo.svg';
import './app.css';
import projectData from './project-data';

class App extends Component {
  render() {
    const projectLinks = projectData.map(proj => (
      <a href="">{proj}</a>
    ))
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
