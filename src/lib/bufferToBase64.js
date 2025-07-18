const bufferToBase64 = (buffer) => {
  let binary = ''
  const chunkSize = 0x8000 //32KB chunks

  for (let i=0; i<buffer.length; i+=chunkSize) {
    const chunk = buffer.slice(i, i+chunkSize)
    binary += String.fromCharCode.apply(null, chunk)
  }

  return btoa(binary)
};

export default bufferToBase64
