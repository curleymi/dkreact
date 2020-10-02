import React from 'react';
import ITunesApiTab from './components/ApiTab';
import Tabs from './components/Tabs';
import './App.css';

function App() {
    return (
        <div className="App">
            <h1>mjc Testing React</h1>
            <Tabs> 
                <div label={ITunesApiTab.Title}><ITunesApiTab/></div>
                <div label="Modals"> 
                    <h2>Click the Button!</h2>
                    <input type="submit" value="Go" />
                </div> 
            </Tabs> 
        </div>
    );
}

export default App;
