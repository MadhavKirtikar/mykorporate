 
export async function sendMessage(input, language) {
  // Dummy response for frontend development
  await new Promise(res => setTimeout(res, 700)); // thoda delay for realism
  return `You said: "${input}"`;
}