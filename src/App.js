import './App.css';
import Checkviz from './components/Checkviz';
import ReliabilityMap from './components/ReliabilityMap';

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
      <ReliabilityMap
        identifier="info"
        isLabel= {false}
        showMissing={true}
        showFalse={true}
        radius={0.8}  // 1.8 for noncategory, 3 for category data
        stroke={4.5}
        drawEdge={true}
      />
      <footer/>
    </div>
  );
}

export default App;
