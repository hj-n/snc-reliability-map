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
        method="umap"
        dataset="mnist"
        isLabel={true}
        showMissing={true}
        showFalse={true}
        radius={3.3}  // 1.8 for noncategory, 3 for category data
        stroke={4.5}
        drawEdge={false}
      />
      <footer/>
    </div>
  );
}

export default App;
