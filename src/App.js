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
      <Checkviz
        method=""
        dataset="spheres_split_angle_5"
        isLabel={true}
        showMissing={true}
        showFalse={true}
        radius={1.3}
        stroke={3}
      />
      <footer/>
    </div>
  );
}

export default App;
