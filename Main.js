/**
 * Auto Wall Module
 * ----------------
 * Adds a button to the wall controls that, when pressed, analyzes the current scene’s
 * background image for the out-of-bounds background (#5d5d5d) and automatically creates walls
 * along the boundary using a Marching Squares algorithm.
 *
 * Note:
 * - All walls in Foundry are straight line segments.
 * - Curved boundaries are approximated by a few straight segments.
 * - This example uses an exact color match for #5d5d5d. Adjust tolerance if needed.
 */

Hooks.on("getSceneControlButtons", controls => {
  // Find the "walls" control group.
  const wallsControl = controls.find(c => c.name === "walls");
  if (wallsControl) {
    wallsControl.tools.push({
      name: "autoWall",
      title: "Auto Place Walls",
      icon: "fas fa-border-all", // Use an icon of your choice
      onClick: () => runAutoWallProcess(),
      button: true
    });
  }
});

async function runAutoWallProcess() {
  // Ensure a scene is active and has a background image.
  const scene = game.scenes.viewed;
  if (!scene) {
    ui.notifications.warn("No active scene found.");
    return;
  }
  if (!scene.img) {
    ui.notifications.warn("The current scene does not have a background image.");
    return;
  }

  // Load the scene’s background image into an offscreen canvas.
  const image = await loadImage(scene.img);
  if (!image) {
    ui.notifications.error("Failed to load the background image.");
    return;
  }
  const w = image.width;
  const h = image.height;
  const offCanvas = document.createElement("canvas");
  offCanvas.width = w;
  offCanvas.height = h;
  const
