function countSubstringSplit(mainString, subString) {
  if (subString.length === 0) {
    return mainString.length + 1; // Handle empty substring case
  }
  return mainString.toLowerCase().split(subString.toLowerCase()).length - 1;
}