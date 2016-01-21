const getColor = function(id) {
  const colors = ['#91a7d0', '#f6cac9', '#bb746b', '#afc94c', '#ff8100', '#ffc3a0'];

  const length = colors.length;
  return colors[id % length];
}

export default getColor;
