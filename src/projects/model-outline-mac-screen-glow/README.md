# Experiment

This iteration of the skull outline series finally gets a gold tooth (or any colored geometry) rendering in tandem with the sobel operator!

That's accomplished by zeroing out the alpha channel of anything that's supossed to retain its colors, and using that as an indicator within the sobel shader to render that fragment's existing color rather than the black/white outline.

This has two big benefits.
1. You no longer see any colored geometry masked out weirdly from the back side. Outlined geometry can occlude colored geometry just fine.
2. It only needs two passes! One to render the scene, and the other to outline it. No mask or copy passes.

There's still one problem to solve, which is that colored elements still have a one pixel outline around them, while everything else still has its two pixel outline. It's unclear at this point if that's a limitation of the sobel operator or if I can hack around that problem.