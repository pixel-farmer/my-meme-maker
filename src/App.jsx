import MemeEditor from './components/MemeEditor';

function App() {
  return (
    <div className="min-h-screen bg-black p-4">
      <div className="container mx-auto">
        <header className="mb-8 flex justify-center">
          <img 
            src="/meme-logo.png"
            alt="Memeulous Logo" 
            className="h-20 w-auto"
          />
        </header>
        <MemeEditor />
      </div>
    </div>
  );
}

export default App;
