const getColor = function(index) {
  const colors = ['#91a7d0', '#f6cac9', '#bb746b', '#afc94c', '#ff8100', '#ffc3a0'];

  const length = colors.length;
  return colors[index % length];
}

export default getColor;
