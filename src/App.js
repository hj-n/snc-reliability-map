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
        dataset="fmnist_1000"
        isLabel={true}
        showMissing={true}
        showFalse={true}
        radius={2.4}  // 2.4
        stroke={4.5}
      />
      <footer/>
    </div>
  );
}

export default App;
