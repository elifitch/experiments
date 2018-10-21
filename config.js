const path = require('path');

function getPath(relativePath) {
  return path.join([__dirname, relativePath]);
}

module.exports = {
  projects: [
    {
      name: 'Model Grin',
      path: getPath('src/projects/model-grin/dist'),
      description: '',
      image: '',
      date: 
    }
  ]
}