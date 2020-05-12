import React from 'react';

import Paint from './Paint';

import './styles/App.scss';

function App() {
    return (
        <div className="test">
            <Paint
                width={1000}
                height={800}
                lineWidth={2}
                smoothness={2}
                thinning={0.3}
            />
        </div>
    );
}

export default App;
