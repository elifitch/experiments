# Experiemnt
So this one didn't turn out how I wanted. I was looking for a smooth outline all around the edges of each tooth, sunglasses, whatever. This technique is only going to give you the outside edges I believe.

A major stumbling block was figuring out that I needed to use JSON loader so I could import a standard geometry, not a buffer geometry. Although it's possible that I wasn't converting between the two properly. Also needed to call `outlineSkullGeometry.computeVertexNormals()` or else the normals were all goofed up and it wouldn't dilate right.

An advantage is that you can easlily use whatever material you want, I used a normal material on the outline mesh to get this rainbow gradient effect.  I could probably simulate something similar by masking a gradient with the sobel outlines though. That would mean another pass, etc blergh.

![the result](example.png)

## Resources
* Working example: http://jsfiddle.net/frh2d84d/7/
* Another working example: http://jsfiddle.net/Eskel/g593q/5/
* General background on outline techniques, some examples here too: https://stackoverflow.com/questions/23245748/uniform-vertex-displacement-for-skinned-mesh-shader-animated-outline-three-js
* General background on outline techniques, some examples here too: https://stackoverflow.com/questions/23183507/outline-object-normal-scale-stencil-mask-three-js
* General background on outline techniques, some examples here too: https://stackoverflow.com/questions/17739760/complex-shape-character-outline/21863009#21863009
* https://github.com/jeromeetienne/threex.geometricglow/blob/master/threex.dilategeometry.js
* Buffer geometry vs regular geometry: https://stackoverflow.com/questions/26607094/three-js-objloader-load-to-geometry-manipulate-then-save-to-buffergeometry