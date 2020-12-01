import './App.css';
import Checkviz from './components/Checkviz';
import Explorer from './components/Explorer';

function App() {
  return (
    <div className="App">
      <header/>
      {/* <Checkviz
        method="tsne"
        dataset="mnist_sampled_50"
        isLabel={true}
        radius={5}
      /> */}
      <Explorer
        method="tsne"
        dataset="mnist_sampled_2"
        isLabel={true}
        showMissing={true}
        showFalse={true}
        radius={2}
        stroke={5}
      />
      <footer/>
    </div>
  );
}

export default App;
