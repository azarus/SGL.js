// This class extends the math library in js (:C)
Math.radians = function(degrees)
{
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
Math.degrees = function(radians)
{
  return radians * 180 / Math.PI;
};

Math.getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};