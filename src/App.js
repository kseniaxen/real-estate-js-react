import React, {useEffect} from 'react'

function App() {
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/country')
        .then(response => response.json())
        .then(responseBody => console.log(responseBody))
        .catch(reason => console.log(reason))
  }, [])
  return (
    <div>

    </div>
  );
}

export default App;
