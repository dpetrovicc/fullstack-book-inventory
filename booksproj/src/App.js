import React from 'react';
import BookList from './components/BookList';
import './App.css'; 

function App() {
  return (
    <div className="App">
      {/* Glavna komponenta koja sadrži tabelu, formu i logiku */}
      <BookList />
    </div>
  );
}

export default App;