
<p align="center">
<img src="https://user-images.githubusercontent.com/38465539/123689703-7c761080-d88e-11eb-9a66-5e545a8ecb08.png" alt="" data-canonical-src="https://user-images.githubusercontent.com/38465539/123689703-7c761080-d88e-11eb-9a66-5e545a8ecb08.png" width="80%"/>
</p>

<p align="center">
  <i>The relaibility map to visualize the distortion measured by Steadiness & Cohesiveness</i>
  <br />
    <a href="https://github.com/hj-n/steadiness-cohesiveness">Steadiness & Cohesiveness</a>
    ·
<!--     <a href=""> -->
      Paper
<!--   </a> -->
    ·
    <a href="mailto:hj@hcil.snu.ac.kr">Contact</a>
  </p>
</p>


## The Reliablity Map

### Overview

Okay - you measured the quality of multidimensional projections (MDP) with Steadiness & Cohesiveness. However, only quantitative metrics cannot intuitively explain how and where distortions occurred in the projection. For further analysis and practical use of the metrics, we need to visualize the occurrence of distortion. We designed _The reliability map_ for such a purpose.

The reliability map visualizes two aspects of MDP distortions: _False Groups_ and _Missing Groups_. 
False Groups distortion denotes where a low-dimensional group in a single cluster consists of separated groups in the original space.
Missing Groups distortion occurs when the original group misses its subgroups, and therefore is divided into many separated subgroups in the projected space.
Steadiness and Cohesiveness evaluate how well projections avoid False and Missing Groups, respectively.


### Functionalities

The reliability map assigns purple to the area with False Groups distortion and does green to the edges with Missing Groups distortions. Moreover, the area with no distortion is represented as white, while the black area denotes the area with both distortions. Note that the color scheme is originated from [_Checkviz_](https://onlinelibrary.wiley.com/doi/full/10.1111/j.1467-8659.2010.01835.x?casa_token=aSBjdWykVHoAAAAA%3A0fo8UMh-dx_NqhD_i4xFQ6TiuCJXC2BtLb11LPycMdAaVOn2ptYGl9Dck9Zgb_J3L-c3TSeZaooANPrI) visualization.

![](https://user-images.githubusercontent.com/38465539/123515745-b0590680-d6d3-11eb-816d-e725fd5841ee.png)
<p align="center">
  <i>Fig 1.</i> The reliability maps that visualize the inter-cluster distortion of t-SNE projections (σ = [1,10,100,1,000]) made for Fashion-MNIST test dataset.
</p>

![](https://user-images.githubusercontent.com/38465539/123687300-babe0080-d88b-11eb-9ed7-2cf3c5700ecb.png)
<p align="center">
   <i>Fig 2.</i> The UMAP, Isomap, and LLE projections of MNIST test dataset and the reliability maps that visualize each projection’s inter-cluster distortion.
</p>

The reliability map also provides the interaction to analyze Missing Groups distortions in detail. By constructing a lasso with simple mouse click interaction, you can see where the "missed groups" of selected area is located.

<p align="center">
<img src="https://user-images.githubusercontent.com/38465539/123516175-c49e0300-d6d5-11eb-9a1c-2215b924ef79.gif" alt="" data-canonical-src="https://user-images.githubusercontent.com/38465539/123516175-c49e0300-d6d5-11eb-9a1c-2215b924ef79.gif" width="55%"/>
</p>


## How to use the reliability map

The reliability map is implemented using React framework and [D3.js](https://d3js.org/), and served as npm project.
To use it, clone this project and inject a distortion info file generated while measuring [Steadiness & Cohesiveness](https://github.com/hj-n/steadiness-cohesiveness#methods).

```sh
git clone https://github.com/hj-n/snc-reliability-map
cd snc-reliability-map

## after injecting files and adjusting parameters
npm i 
npm start
```

### Setup

By calling `SNC.vis_info(file_path)` method after computing Steadiness & Cohesiveness (please refer to the [API](https://github.com/hj-n/steadiness-cohesiveness#methods)), a json file with distortion infos are saved in designated `file_path`. Copy & paste the files to `snc-reliability-map/src/json/` and set required arguments to run the program.

### API

The reliability map is served as React component embedded in a React web application. Change the props for the component!!

```javascript

<ReliabilityMap
  identifier="identifier"
  isLabel= {false}
  showMissing={true}
  showFalse={true}
  drawEdge={true}
  radius={radius} 
  stroke={stroke}
/>

```

> - **`identifier`** : `string`
>   - the identifier of distortion info files (set by Steadiness & Cohesiveness).
>   - if the name of file is `abs.json`, identifier should be `abs`.
> - **`isLabel`** : `bool`
>   - if `true` and there exists a file holds the label (class) information, the reliability map also visualizes the label info by encoding color to each point.
> - **`showMissing, showFalse`** : `bool` 
>   - if `true`, visualizes Missing / False distortions, respectively.
> - **`drawEdge`** : `bool`
>   - determines whether to display edges that encode distortion
> - **`radius, stroke`** : `float`
>   - set the radius of data points / the stroke width of edges


## Reference / Citation

TBA

## Contact

If you are interested in using the reliability map in you project, feel free to contact!! ([hj@hcil.snu.ac.kr](mailto:hj@hcil.snu.ac.kr))







