// Import pako
//const pako = require('pako');

// Helper function to encode string to Uint8Array
function encodeChunk(chunk) {
  const encoder = new TextEncoder();
  return encoder.encode(chunk);
}

// Example: Handling large text data in chunks
function compressLargeText(text) {
  const chunkSize = 64 * 1024; // 64kb chunks
  const deflate = new pako.Deflate({ level: 6 }); // Create a Deflate instance

  let offset = 0;
  while (offset < text.length) {
    const end = Math.min(offset + chunkSize, text.length);
    const chunk = text.slice(offset, end);

    const encodedChunk = encodeChunk(chunk);
    deflate.push(encodedChunk, end >= text.length); // true if it's the last chunk

    offset = end;
  }

  if (deflate.err) {
    console.error('Compression error:', deflate.err);
    return null;
  }

  return deflate.result;
}

// Helper function to decode Uint8Array back to string
function decodeChunk(chunk) {
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(chunk);
}
  
// Decompressing function
function decompressLargeData(compressedData) {
    const inflate = new pako.Inflate(); // Create an Inflate instance

    // Push the compressed data
    inflate.push(compressedData, true); // true indicates it's the last chunk

    // Check for errors
    if (inflate.err) {
        console.error('Decompression error:', inflate.err);
        return null;
    }

    // Get the decompressed result
    const decompressedData = inflate.result;

    // Decode the decompressed result back to string
    return decodeChunk(decompressedData);
}
  