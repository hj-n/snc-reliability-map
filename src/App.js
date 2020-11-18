import './App.css';
import Explorer from './components/Explorer';

function App() {
  return (
    <div className="App">
      <header/>
      <Explorer
        method="pca"
        dataset="mnist_sampled_2"
        isLabel={false}
        showMissing={true}
        showFalse={true}
        radius={0.7}
        stroke={1.5}
      />
      <footer/>
    </div>
  );
}

export default App;
